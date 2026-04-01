const db = require('../config/db');

// Create a record
exports.createRecord = (req, res) => {
    const { user_id, amount, type, category, date, notes } = req.body;

    // Input Validation
    if (!user_id || !amount || !type || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }
    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ error: 'Type must be "income" or "expense"' });
    }

    const query = `INSERT INTO financial_records (user_id, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [user_id, amount, type, category, date, notes], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Record created successfully', recordId: this.lastID });
    });
};

// Get all records (with filtering)
exports.getRecords = (req, res) => {
    const { type, category, startDate, endDate } = req.query;
    
    // We use "WHERE 1=1" as a trick to easily append "AND" clauses dynamically
    let query = `SELECT * FROM financial_records WHERE 1=1`;
    const params = [];

    if (type) {
        query += ` AND type = ?`;
        params.push(type);
    }
    if (category) {
        query += ` AND category = ?`;
        params.push(category);
    }
    if (startDate && endDate) {
        query += ` AND date BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(rows);
    });
};

// Update a record
exports.updateRecord = (req, res) => {
    const { id } = req.params;
    const { amount, type, category, date, notes } = req.body;

    const query = `UPDATE financial_records SET amount = ?, type = ?, category = ?, date = ?, notes = ? WHERE id = ?`;
    
    db.run(query, [amount, type, category, date, notes, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Record not found' });
        res.status(200).json({ message: 'Record updated successfully' });
    });
};

// Delete a record
exports.deleteRecord = (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM financial_records WHERE id = ?`;

    db.run(query, id, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Record not found' });
        res.status(200).json({ message: 'Record deleted successfully' });
    });
};
