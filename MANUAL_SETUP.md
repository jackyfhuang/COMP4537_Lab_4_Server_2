# Manual Database Setup Guide

If the command line setup doesn't work, use one of these methods:

## Method 1: Using Node.js Setup Script (Easiest)

1. Navigate to server2 directory:
   ```bash
   cd server2
   ```

2. Run the setup script:
   ```bash
   node setup-database.js
   ```

3. Enter your MySQL root credentials when prompted.

## Method 2: Using MySQL Workbench

1. **Open MySQL Workbench** and connect as root user

2. **Click on "File" → "Open SQL Script"** or press `Ctrl+Shift+O`

3. **Navigate to** `server2/setup_database.sql` and open it

4. **Execute the script** by clicking the lightning bolt icon (⚡) or pressing `Ctrl+Shift+Enter`

5. **Verify** by running:
   ```sql
   SHOW DATABASES;
   USE lab4_patients_db;
   SHOW GRANTS FOR 'lab4_readonly_user'@'localhost';
   SHOW GRANTS FOR 'lab4_insert_user'@'localhost';
   ```

## Method 3: Using phpMyAdmin

1. **Open phpMyAdmin** in your browser (usually `http://localhost/phpmyadmin`)

2. **Click on "SQL" tab** at the top

3. **Copy and paste** the contents of `server2/setup_database.sql`

4. **Click "Go"** to execute

5. **Verify** by checking:
   - Databases list should show `lab4_patients_db`
   - Users should show the two new users

## Method 4: Manual SQL Execution

1. **Open MySQL command line**:
   ```bash
   mysql -u root -p
   ```

2. **Copy and paste each command** from `setup_database.sql` one by one:

   ```sql
   CREATE DATABASE IF NOT EXISTS lab4_patients_db;
   
   CREATE USER IF NOT EXISTS 'lab4_readonly_user'@'localhost' IDENTIFIED BY 'readonly_password';
   GRANT SELECT ON lab4_patients_db.* TO 'lab4_readonly_user'@'localhost';
   
   CREATE USER IF NOT EXISTS 'lab4_insert_user'@'localhost' IDENTIFIED BY 'insert_password';
   GRANT SELECT, INSERT, CREATE ON lab4_patients_db.* TO 'lab4_insert_user'@'localhost';
   
   FLUSH PRIVILEGES;
   ```

3. **Verify** with:
   ```sql
   SHOW DATABASES;
   SELECT User, Host FROM mysql.user WHERE User LIKE 'lab4%';
   ```

## Method 5: Using XAMPP/WAMP Control Panel

1. **Start MySQL** from XAMPP/WAMP control panel

2. **Open phpMyAdmin** (usually at `http://localhost/phpmyadmin`)

3. **Follow Method 3** above

## Troubleshooting

### "Access denied" error
- Make sure you're using the correct MySQL root password
- On some systems, you might need to use `sudo` or run as administrator

### "Command not found: mysql"
- MySQL might not be in your PATH
- Try using the full path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe -u root -p`
- Or use MySQL Workbench/phpMyAdmin instead

### "CREATE USER" fails
- The user might already exist - this is okay, the script uses `IF NOT EXISTS`
- You can drop and recreate: `DROP USER IF EXISTS 'lab4_readonly_user'@'localhost';`

### Can't find setup_database.sql
- Make sure you're in the correct directory
- The file should be at: `server2/setup_database.sql`

## After Setup

Test the connections:
```bash
cd server2
node test-connection.js
```

You should see both connections succeed. Then start the server:
```bash
npm start
```
