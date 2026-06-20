const metaService = require("../services/meta.service");
const { sendSuccess } = require("../utils/response.utils");

const getMeta = async (req, res, next) => {
  try {
    const data = await metaService.getMeta();
    return sendSuccess(res, {
      status: 200,
      message: "Meta retrieved successfully",
      data,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getMeta };
