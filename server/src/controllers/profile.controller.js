const profileService = require("../services/profile.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    return sendSuccess(res, {
      status: 200,
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (err) {
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const profileImage = req.file
      ? { buffer: req.file.buffer, mimetype: req.file.mimetype }
      : null;

    if (!firstName && !lastName && !profileImage) {
      return sendError(res, {
        status: 400,
        message: "Provide at least one field to update: firstName, lastName, or profile_image",
      });
    }

    const profile = await profileService.updateProfile({
      userId: req.user.id,
      fields: { firstName, lastName },
      profileImage,
    });

    return sendSuccess(res, {
      status: 200,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProfile, updateProfile };
