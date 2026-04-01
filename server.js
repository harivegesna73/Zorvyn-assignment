const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/userRoutes');
const recordRoutes = require('./src/routes/recordRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes'); // <-- Add this

const app = express();

// MIDDLEWARE (Must come first!)
app.use(cors());
app.use(express.json()); // <-- If this is missing or below the routes, req.body will be undefined

// ROUTES (Must come second!)
app.use('/users', userRoutes);
app.use('/records', recordRoutes);
app.use('/dashboard', dashboardRoutes); // <-- Add this

// Global Error Handling Middleware (Keep this below all other routes)
app.use((req, res, next) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

// Use Render's dynamically injected PORT, or default to 3000 locally
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});