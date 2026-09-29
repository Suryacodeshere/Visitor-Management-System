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
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

mongoose.connect(MONGO_URI)
  .then(async () => {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    // Ensure default admin user exists with password from env
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASS, salt);
    await User.findOneAndUpdate(
      { username: ADMIN_USER },
      { password: hashedPassword, role: 'admin' },
      { upsert: true, new: true }
    );
    console.log(`Admin user verified: ${ADMIN_USER}`);

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
