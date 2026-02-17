// Database configuration
// Store user strings at the top of the code

// Read-only user configuration (for SELECT queries only)
const DB_CONFIG_READONLY = {
    host: 'localhost',
    user: 'lab4_readonly_user',  
    password: 'readonly_password',  
    database: 'lab4_patients_db',
    multipleStatements: false  
};

// Insert user configuration (for INSERT operations)
const DB_CONFIG_INSERT = {
    host: 'localhost',
    user: 'lab4_insert_user',  
    password: 'insert_password',  
    database: 'lab4_patients_db',
    multipleStatements: false 
};

// Patient data to insert
const PATIENT_DATA = [
    ['Sara Brown', '1901-01-01'],
    ['John Smith', '1941-01-01'],
    ['Jack Ma', '1961-01-30'],
    ['Elon Musk', '1999-01-01']
];

module.exports = {
    DB_CONFIG_READONLY,
    DB_CONFIG_INSERT,
    PATIENT_DATA
};
