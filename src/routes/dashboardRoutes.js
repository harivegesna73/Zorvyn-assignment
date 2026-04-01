const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Require authentication
router.use(authenticate);

// Viewers, Analysts, and Admins can all view the dashboard summary
router.get('/summary', authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getDashboardSummary);

module.exports = router;
