module.exports = (req, res, next) => {
  if (req.user?.isDemo) {
    return res.status(403).json({
      success: false,
      message:
        "Demo mode is read-only. Editing is disabled.",
    });
  }

  next();
};