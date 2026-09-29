const Visitor = require('../models/Visitor');

const addVisitor = async (req, res) => {
  try {
    const { name, mobile, companyName, personToMeet, purpose } = req.body;
    const newVisitor = new Visitor({ name, mobile, companyName, personToMeet, purpose });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getVisitors = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { mobile: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const visitors = await Visitor.find(query).sort({ entryTime: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
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
    const count = await Visitor.countDocuments({ entryTime: { $gte: today } });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
  addVisitor, getVisitors, getVisitorById, getTodayStats, updateVisitor, deleteVisitor
};
