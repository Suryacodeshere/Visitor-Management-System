const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'visitorApp_superSecret_2026';

const protect = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const secret = getJwtSecret();
    const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const decoded = jwt.verify(tokenString, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access denied. Role '${req.user?.role}' is not authorized.` });
    }
    next();
  };
};

module.exports = { protect, authorize };
