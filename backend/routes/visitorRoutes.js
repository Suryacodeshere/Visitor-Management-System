const express = require('express');
const router = express.Router();
const { addVisitor, checkVisitorStatus, getVisitors, getVisitorById, getTodayStats, updateVisitor, updateVisitorStatus, deleteVisitor } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes — visitors can register & check their status
router.post('/', addVisitor);
router.get('/check-status/:mobile', checkVisitorStatus);

// Admin-only protected routes
router.get('/', protect, authorize('admin'), getVisitors);
router.get('/stats/today', protect, authorize('admin'), getTodayStats);
router.get('/:id', protect, authorize('admin'), getVisitorById);
router.put('/:id', protect, authorize('admin'), updateVisitor);
router.patch('/:id/status', protect, authorize('admin'), updateVisitorStatus);
router.delete('/:id', protect, authorize('admin'), deleteVisitor);

module.exports = router;
