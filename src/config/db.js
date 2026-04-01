const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Enable Foreign Keys in SQLite
        db.run('PRAGMA foreign_keys = ON;');

        // Initialize Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT CHECK(role IN ('Viewer', 'Analyst', 'Admin')) NOT NULL,
            status TEXT CHECK(status IN ('active', 'inactive')) DEFAULT 'active'
        )`);

        // Initialize Financial Records table
        db.run(`CREATE TABLE IF NOT EXISTS financial_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);
    }
});

module.exports = db;