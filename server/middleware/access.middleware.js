const access = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) {
      next();
    } else {
      res
        .status(401)
        .json({ message: "You are not authorized to perform this action." });
    }
  };
};

module.exports = access;
