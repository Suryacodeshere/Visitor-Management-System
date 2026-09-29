const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://visitor-management-frontend-eta.vercel.app',
  /\.vercel\.app$/
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

const visitorRoutes = require('./routes/visitorRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/visitors', visitorRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/visitor_db';

mongoose.connect(MONGO_URI)
  .then(async () => {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    // Seed default admin user if not existing
    let adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });.
      
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
