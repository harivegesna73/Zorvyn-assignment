const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Apply authentication to all user routes
router.use(authenticate);

// Only Admins can manage users
router.post('/', authorize('Admin'), userController.createUser);
router.get('/', authorize('Admin'), userController.getAllUsers);

module.exports = router;
