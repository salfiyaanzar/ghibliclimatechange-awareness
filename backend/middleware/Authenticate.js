const jwt = require('jsonwebtoken');

const secret = 'asdfe45we45w345wegw345werjktjwertkj'; // ✅ Use the correct secret

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, secret); // ✅ Correct secret here
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
