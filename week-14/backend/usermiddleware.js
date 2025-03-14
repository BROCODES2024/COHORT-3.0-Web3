const jwt = require("jsonwebtoken");
require("dotenv").config();
const usersec = process.env.jwtusersec;
function usermiddleware(req, res, next) {
  const token = req.headers.token;
  const decoded = jwt.verify(token, usersec);
  if (decoded) {
    //here decoded.id comes from  sigin endpoint in user.js where we sent token as result which has id
    req.userId = decoded.id;
    next();
  } else {
    res.status(403).json({
      msg: "not signed in",
    });
  }
}
module.exports = {
  usermiddleware: usermiddleware,
};
