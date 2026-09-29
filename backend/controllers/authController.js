const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const cleanUsername = username ? username.trim() : '';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ 
      username: cleanUsername, 
      password: hashedPassword,
      role: role || 'admin'
    });
    await newUser.save();
    
    res.status(201).json({ message: 'User created successfully', username: newUser.username, role: newUser.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide both username and password' });
    }
    const cleanUsername = username.trim();
    const user = await User.findOne({ username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } });
    if (!user) return res.status(400).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
