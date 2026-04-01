const db = require('../config/db');

// Create a new user
exports.createUser = (req, res) => {
    const { name, email, role } = req.body;

    // Basic validation
    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required' });
    }

    const query = `INSERT INTO users (name, email, role) VALUES (?, ?, ?)`;
    
    // Using regular function (not arrow) so 'this' binds to the sqlite statement object to get lastID
    db.run(query, [name, email, role], function(err) {
        if (err) {
            // Handle unique email constraint error
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            message: 'User created successfully', 
            userId: this.lastID 
        });
    });
};

// Get all users
exports.getAllUsers = (req, res) => {
    const query = `SELECT id, name, email, role, status FROM users`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};