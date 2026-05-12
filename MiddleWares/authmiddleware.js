const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secretkey = process.env.secretkey;
const AuthMiddleWare = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Token Missing",
      });
    }
    const token = authHeader.split(" ")[1];
    const verifyToken = jwt.verify(token, secretkey);
    req.user = verifyToken;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};
module.exports = AuthMiddleWare;
