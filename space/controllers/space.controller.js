const { spaceService } = require("../index");

exports.getCurrentSpace = async (req, res, next) => {
  try {
    const space = await spaceService.getCurrentSpace(req.user._id);

    res.status(200).json({
      success: true,
      data: space,
    });
  } catch (error) {
    next(error);
  }
};