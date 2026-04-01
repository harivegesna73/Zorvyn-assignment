const db = require('../config/db');

// Helper function to turn SQLite callbacks into Promises
const queryPromise = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.getDashboardSummary = async (req, res) => {
    try {
        // 1. Get Total Income and Total Expenses
        const totalsQuery = `
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
            FROM financial_records
        `;
        const totalsResult = await queryPromise(totalsQuery);
        const totals = totalsResult[0];
        
        // Ensure we don't return null if the database is empty
        const totalIncome = totals.totalIncome || 0;
        const totalExpense = totals.totalExpense || 0;
        const netBalance = totalIncome - totalExpense;

        // 2. Get Category-wise Totals
        const categoryQuery = `
            SELECT category, type, SUM(amount) as total
            FROM financial_records
            GROUP BY category, type
            ORDER BY total DESC
        `;
        const categoryBreakdown = await queryPromise(categoryQuery);

        // 3. Get Recent Activity (Last 5 transactions)
        const recentActivityQuery = `
            SELECT id, amount, type, category, date 
            FROM financial_records 
            ORDER BY date DESC, id DESC 
            LIMIT 5
        `;
        const recentActivity = await queryPromise(recentActivityQuery);

        // Send it all back in one beautiful JSON package
        res.status(200).json({
            overview: {
                totalIncome,
                totalExpense,
                netBalance
            },
            categoryBreakdown,
            recentActivity
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to generate dashboard summary', details: error.message });
    }
};
