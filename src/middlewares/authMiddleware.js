const db = require('../config/db');

// Middleware to "authenticate" the user via a mock header
exports.authenticate = (req, res, next) => {
    // In a real app, this would be a JWT token. Here, we use a simple header.
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing user-id header' });
    }

    const query = `SELECT id, name, email, role, status FROM users WHERE id = ?`;
    
    db.get(query, [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Unauthorized: User not found' });
        if (user.status === 'inactive') return res.status(403).json({ error: 'Forbidden: User account is inactive' });

        // Attach the user object to the request so downstream routes can use it
        req.user = user;
        next(); // Move on to the next middleware or the controller
    });
};

// Middleware factory to check roles
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user is set by the authenticate middleware above
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: `Forbidden: You do not have the required permissions. Role required: ${allowedRoles.join(' or ')}` 
            });
        }
        next();
    };
};
