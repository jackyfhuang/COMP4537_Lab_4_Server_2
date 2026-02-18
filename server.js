// Lab 4 - Patient Database API Server
// Attribution: ChatGPT was used to assist with code structure and implementation

const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');
const { DB_CONFIG_READONLY, DB_CONFIG_INSERT, PATIENT_DATA } = require('./dbConfig');

const BLOCKED_KEYWORDS = ['DROP', 'DELETE', 'UPDATE', 'CREATE', 'ALTER', 'TRUNCATE', 'INSERT'];

// Helper function to set CORS headers
function setCORSHeaders(response) {
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Create patient table if it doesn't exist (checked on every INSERT)
async function createTableIfNotExists(connection) {
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS patient (
            patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            dateOfBirth DATETIME NOT NULL
        ) ENGINE=InnoDB
    `);
}

// Validate SQL query - only allow SELECT statements
function validateSQLQuery(query) {
    if (!query || typeof query !== 'string') {
        return { valid: false, error: 'Invalid query' };
    }

    const upperQuery = query.trim().toUpperCase();
    
    if (!upperQuery.startsWith('SELECT')) {
        return { valid: false, error: 'Only SELECT queries are allowed' };
    }
    
    // Check for blocked keywords
    for (const keyword of BLOCKED_KEYWORDS) {
        if (upperQuery.includes(keyword)) {
            return { valid: false, error: `Operation '${keyword}' is not allowed` };
        }
    }

    return { valid: true };
}

// Handle POST request - Insert patient data
async function handlePOST(request, response) {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG_INSERT);
        
        await createTableIfNotExists(connection);

        // Insert patient data
        const insertQuery = 'INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)';
        for (const [name, dateOfBirth] of PATIENT_DATA) {
            await connection.execute(insertQuery, [name, dateOfBirth]);
        }

        setCORSHeaders(response);
        response.writeHead(200);
        response.end(JSON.stringify({
            success: true,
            message: `Successfully inserted ${PATIENT_DATA.length} patient records`,
            inserted: PATIENT_DATA.length
        }));

    } catch (error) {
        console.error('Error in POST handler:', error);
        setCORSHeaders(response);
        response.writeHead(500);
        response.end(JSON.stringify({ 
            success: false, 
            error: error.message || error.toString() || 'Database connection failed' 
        }));
    } finally {
        if (connection) await connection.end();
    }
}

// Handle GET request - Execute SELECT query
async function handleGET(request, response) {
    let connection;
    try {
        const parsedUrl = url.parse(request.url, true);
        const path = parsedUrl.pathname;

        // Extract SQL query from URL path: /api/v1/sql/"SELECT * FROM patient"
        if (!path.includes('/api/v1/sql/')) {
            setCORSHeaders(response);
            response.writeHead(400);
            response.end(JSON.stringify({ success: false, error: 'Invalid endpoint' }));
            return;
        }

        let sqlQuery = decodeURIComponent(path.split('/api/v1/sql/')[1]);
        sqlQuery = sqlQuery.replace(/^["']|["']$/g, ''); // Remove quotes if present

        if (!sqlQuery) {
            setCORSHeaders(response);
            response.writeHead(400);
            response.end(JSON.stringify({ success: false, error: 'No SQL query provided' }));
            return;
        }

        // Validate SQL query (server-side check)
        const validation = validateSQLQuery(sqlQuery);
        if (!validation.valid) {
            setCORSHeaders(response);
            response.writeHead(400);
            response.end(JSON.stringify({ success: false, error: validation.error }));
            return;
        }

        // Create connection with read-only privileges (Principle of Least Privilege)
        connection = await mysql.createConnection(DB_CONFIG_READONLY);
        const [rows] = await connection.execute(sqlQuery);

        setCORSHeaders(response);
        response.writeHead(200);
        response.end(JSON.stringify({
            success: true,
            data: rows,
            count: rows.length
        }));

    } catch (error) {
        console.error('Error in GET handler:', error);
        setCORSHeaders(response);
        response.writeHead(500);
        response.end(JSON.stringify({ 
            success: false, 
            error: error.message || error.toString() || 'Database connection failed' 
        }));
    } finally {
        if (connection) await connection.end();
    }
}

// Handle OPTIONS request for CORS preflight
function handleOPTIONS(response) {
    setCORSHeaders(response);
    response.writeHead(200);
    response.end();
}

// Main server
const server = http.createServer((request, response) => {
    const method = request.method;

    if (method === 'OPTIONS') {
        handleOPTIONS(response);
    } else if (method === 'POST') {
        handlePOST(request, response);
    } else if (method === 'GET') {
        handleGET(request, response);
    } else {
        setCORSHeaders(response);
        response.writeHead(405);
        response.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`POST endpoint: http://localhost:${PORT}`);
    console.log(`GET endpoint: http://localhost:${PORT}/api/v1/sql/"SELECT * FROM patient"`);
});
