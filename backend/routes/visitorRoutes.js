const express = require('express');
const router = express.Router();
const { addVisitor, getVisitors, getVisitorById, getTodayStats, updateVisitor, deleteVisitor } = require('../controllers/visitorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('admin', 'receptionist'), addVisitor);
router.get('/', protect, authorize('admin', 'receptionist'), getVisitors);
router.get('/stats/today', protect, authorize('admin', 'receptionist'), getTodayStats);
router.get('/:id', protect, authorize('admin', 'receptionist'), getVisitorById);
router.put('/:id', protect, authorize('admin', 'receptionist'), updateVisitor);
router.delete('/:id', protect, authorize('admin'), deleteVisitor);

module.exports = router;
