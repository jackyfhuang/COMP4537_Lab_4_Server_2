// Database setup script - Run this with a user that has CREATE DATABASE and GRANT privileges
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabase() {
    console.log('=== Database Setup for Lab 4 ===\n');
    console.log('You need MySQL root credentials to set up the database.\n');

    const host = await question('MySQL host (default: localhost): ') || 'localhost';
    const rootUser = await question('MySQL root username (default: root): ') || 'root';
    const rootPassword = await question('MySQL root password: ');

    let connection;
    try {
        console.log('\nConnecting to MySQL...');
        connection = await mysql.createConnection({
            host: host,
            user: rootUser,
            password: rootPassword,
            multipleStatements: true
        });
        console.log('✓ Connected to MySQL\n');

        // Create database
        console.log('Creating database...');
        await connection.query('CREATE DATABASE IF NOT EXISTS lab4_patients_db');
        console.log('✓ Database created\n');

        // Create read-only user
        console.log('Creating read-only user...');
        try {
            await connection.query(`
                CREATE USER IF NOT EXISTS 'lab4_readonly_user'@'localhost' IDENTIFIED BY 'readonly_password'
            `);
        } catch (err) {
            if (!err.message.includes('already exists')) throw err;
        }
        await connection.query(`
            GRANT SELECT ON lab4_patients_db.* TO 'lab4_readonly_user'@'localhost'
        `);
        console.log('✓ Read-only user created\n');

        // Create insert user
        console.log('Creating insert user...');
        try {
            await connection.query(`
                CREATE USER IF NOT EXISTS 'lab4_insert_user'@'localhost' IDENTIFIED BY 'insert_password'
            `);
        } catch (err) {
            if (!err.message.includes('already exists')) throw err;
        }
        await connection.query(`
            GRANT SELECT, INSERT, CREATE ON lab4_patients_db.* TO 'lab4_insert_user'@'localhost'
        `);
        console.log('✓ Insert user created\n');

        // Flush privileges
        await connection.query('FLUSH PRIVILEGES');
        console.log('✓ Privileges flushed\n');

        console.log('=== Setup Complete! ===\n');
        console.log('Database: lab4_patients_db');
        console.log('Read-only user: lab4_readonly_user (password: readonly_password)');
        console.log('Insert user: lab4_insert_user (password: insert_password)\n');
        console.log('You can now start the server with: npm start');

    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error('\nMake sure:');
        console.error('1. MySQL/MariaDB is running');
        console.error('2. You have the correct root credentials');
        console.error('3. The root user has CREATE DATABASE and GRANT privileges');
    } finally {
        if (connection) {
            await connection.end();
        }
        rl.close();
    }
}

setupDatabase();
