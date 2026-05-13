
const jwt = require("jsonwebtoken");
const AuthMiddleWare = (
  req,
  res,
  next
) => {
  try {

    const authHeader =
      req.headers.authorization;

    console.log(authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }

    // remove Bearer
    const token =
      authHeader.split(" ")[1];

    console.log(token);

    const decoded = jwt.verify(
      token,
      process.env.secretkey
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = AuthMiddleWare;