const jwt = require("jsonwebtoken");
require("dotenv").config();
const usersec = process.env.jwtusersec;

function usermiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, usersec);
    req.userId = decoded.id; // Set user ID for later use
    next();
  } catch (error) {
    return res.status(403).json({ msg: "Unauthorized: Invalid token" });
  }
}

module.exports = { usermiddleware };
