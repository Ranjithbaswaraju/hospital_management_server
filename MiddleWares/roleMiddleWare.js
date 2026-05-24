const checkRole = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access Denied",
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Role Authorization Failed",
      });
    }
  };
};
module.exports = checkRole;
