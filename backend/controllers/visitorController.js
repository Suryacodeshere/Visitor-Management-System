const Visitor = require('../models/Visitor');

const addVisitor = async (req, res) => {
  try {
    const { name, mobile, companyName, personToMeet, purpose } = req.body;
    
    // Check if visitor registered today with this mobile number
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingVisitor = await Visitor.findOne({
      mobile: mobile.trim(),
      entryTime: { $gte: today }
    }).sort({ entryTime: -1 }).lean();

    if (existingVisitor) {
      return res.status(200).json({
        isExisting: true,
        message: 'A visit request with this mobile number already exists for today.',
        visitor: existingVisitor
      });
    }

    const newVisitor = new Visitor({ 
      name, 
      mobile: mobile.trim(), 
      companyName, 
      personToMeet, 
      purpose,
      status: 'Pending'
    });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const checkVisitorStatus = async (req, res) => {
  try {
    const { mobile } = req.params;
    if (!mobile || mobile.trim().length !== 10) {
      return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number' });
    }

    const visitor = await Visitor.findOne({ mobile: mobile.trim() }).sort({ entryTime: -1 }).lean();
    if (!visitor) {
      return res.status(404).json({ error: 'No visitor record found for this mobile number.' });
    }

    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVisitors = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }
    const visitors = await Visitor.find(query).sort({ entryTime: -1 }).lean();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).lean();
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayQuery = { entryTime: { $gte: today } };
    
    // Execute all 4 counts concurrently using Promise.all for 4x faster stats!
    const [count, pending, approved, cancelled] = await Promise.all([
      Visitor.countDocuments(todayQuery),
      Visitor.countDocuments({ ...todayQuery, status: 'Pending' }),
      Visitor.countDocuments({ ...todayQuery, status: 'Approved' }),
      Visitor.countDocuments({ ...todayQuery, status: 'Cancelled' })
    ]);

    res.status(200).json({ count, pending, approved, cancelled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateVisitorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addVisitor, checkVisitorStatus, getVisitors, getVisitorById, getTodayStats, updateVisitor, updateVisitorStatus, deleteVisitor
};
