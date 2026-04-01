const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Require authentication for all record routes
router.use(authenticate);

// Analysts and Admins can view records
router.get('/', authorize('Admin', 'Analyst'), recordController.getRecords);

// Only Admins can modify records
router.post('/', authorize('Admin'), recordController.createRecord);
router.put('/:id', authorize('Admin'), recordController.updateRecord);
router.delete('/:id', authorize('Admin'), recordController.deleteRecord);

module.exports = router;
