module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // đã có từ authMiddleware
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have permission" });
    }
    next();
  };
};