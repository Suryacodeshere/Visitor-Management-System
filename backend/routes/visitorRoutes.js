const express = require('express');
const router = express.Router();
const { addVisitor, getVisitors, getVisitorById, getTodayStats, updateVisitor, deleteVisitor } = require('../controllers/visitorController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, addVisitor);
router.get('/', protect, getVisitors);
router.get('/stats/today', protect, getTodayStats);
router.get('/:id', protect, getVisitorById);
router.put('/:id', protect, updateVisitor);
router.delete('/:id', protect, deleteVisitor);

module.exports = router;
