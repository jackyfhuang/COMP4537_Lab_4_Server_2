// Test database connection
const mysql = require('mysql2/promise');
const { DB_CONFIG_READONLY, DB_CONFIG_INSERT } = require('./dbConfig');

async function testConnections() {
    console.log('Testing database connections...\n');

    // Test read-only connection
    console.log('1. Testing read-only user connection...');
    try {
        const readConn = await mysql.createConnection(DB_CONFIG_READONLY);
        console.log('   ✓ Read-only connection successful');
        await readConn.end();
    } catch (error) {
        console.error('   ✗ Read-only connection failed:', error.message);
        console.error('   Make sure the database and user are created.');
        console.error('   Run: mysql -u root -p < setup_database.sql\n');
    }

    // Test insert connection
    console.log('2. Testing insert user connection...');
    try {
        const insertConn = await mysql.createConnection(DB_CONFIG_INSERT);
        console.log('   ✓ Insert connection successful');
        await insertConn.end();
    } catch (error) {
        console.error('   ✗ Insert connection failed:', error.message);
        console.error('   Make sure the database and user are created.');
        console.error('   Run: mysql -u root -p < setup_database.sql\n');
    }

    console.log('\nIf both connections succeeded, you can start the server with: npm start');
}

testConnections().catch(console.error);
