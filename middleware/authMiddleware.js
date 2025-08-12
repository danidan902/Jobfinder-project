import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth Header:', authHeader);  

  if (!authHeader) {
    console.log('No Authorization header');
    return res.status(401).json({ message: "Access denied" });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('Invalid Authorization header format');
    return res.status(401).json({ message: "Access denied, invalid token format" });
  }

  const token = parts[1];
  console.log('Token extracted:', token);  // Debug

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    res.status(400).json({ message: "Invalid token" });
  }
}

export default authMiddleware;
