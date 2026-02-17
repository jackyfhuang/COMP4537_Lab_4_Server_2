# Server2 - Node.js API Server

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up MySQL database and users:

   Option A: Run the SQL setup script (recommended):
   ```bash
   mysql -u root -p < setup_database.sql
   ```

   Option B: Manually create database and users:
   ```sql
   CREATE DATABASE lab4_patients_db;
   
   -- Read-only user (SELECT only)
   CREATE USER 'lab4_readonly_user'@'localhost' IDENTIFIED BY 'readonly_password';
   GRANT SELECT ON lab4_patients_db.* TO 'lab4_readonly_user'@'localhost';
   
   -- Insert user (SELECT, INSERT, and CREATE for table creation)
   CREATE USER 'lab4_insert_user'@'localhost' IDENTIFIED BY 'insert_password';
   GRANT SELECT, INSERT, CREATE ON lab4_patients_db.* TO 'lab4_insert_user'@'localhost';
   
   FLUSH PRIVILEGES;
   ```

3. Update `dbConfig.js` with your actual database credentials if different from defaults.

4. Start the server:
```bash
npm start
```

The server will run on port 3000 by default.

## API Endpoints

### POST `/`
Inserts patient data into the database. Creates the table if it doesn't exist.

**Request:** POST request to root endpoint
**Response:** JSON with success status and number of records inserted

### GET `/api/v1/sql/{query}`
Executes a SELECT query. The query should be URL-encoded.

**Example:**
```
GET /api/v1/sql/SELECT%20*%20FROM%20patient
```

**Response:** JSON with success status and query results

## Security Features

- **Principle of Least Privilege**: Database users are configured with minimal required privileges
  - Read-only user: SELECT only
  - Insert user: SELECT, INSERT, and CREATE (for table creation only; no UPDATE, DELETE, DROP, ALTER, etc.)
- **Server-side validation**: Blocks dangerous SQL keywords (DROP, DELETE, UPDATE, CREATE, etc.)
- **Query type restriction**: Only SELECT queries are allowed via GET endpoint
- **Prepared statements**: Uses parameterized queries to prevent SQL injection

## Important Notes

- The table is automatically created on the first INSERT operation if it doesn't exist
- The table existence is checked on every INSERT request
- All dangerous operations (DROP, DELETE, UPDATE, CREATE) are blocked both by:
  1. Database user privileges (enforced by MySQL)
  2. Server-side validation (additional layer of security)
