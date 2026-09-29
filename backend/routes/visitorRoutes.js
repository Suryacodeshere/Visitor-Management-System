const express = require('express');
const router = express.Router();
const { addVisitor, getVisitors, getVisitorById, getTodayStats, updateVisitor, updateVisitorStatus, deleteVisitor } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route — visitors can list/register themselves
router.post('/', addVisitor);

// Admin-only protected routes
router.get('/', protect, authorize('admin'), getVisitors);
router.get('/stats/today', protect, authorize('admin'), getTodayStats);
router.get('/:id', protect, authorize('admin'), getVisitorById);
router.put('/:id', protect, authorize('admin'), updateVisitor);
router.patch('/:id/status', protect, authorize('admin'), updateVisitorStatus);
router.delete('/:id', protect, authorize('admin'), deleteVisitor);

module.exports = router;
