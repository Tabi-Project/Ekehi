const adminService = require("../services/admin.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getContentItem = async (req, res, next) => {
  try {
    const { contentType, id } = req.params;
    const item = await adminService.getContentItem(contentType, id);
    return sendSuccess(res, { status: 200, message: "Item retrieved", data: item });
  } catch (err) {
    if (err.status) return sendError(res, { status: err.status, message: err.message });
    return next(err);
  }
};

const getMySubmissions = async (req, res, next) => {
  try {
    const items = await adminService.getMySubmissions(req.user.id);
    return sendSuccess(res, { status: 200, message: "Submissions retrieved", data: items });
  } catch (err) {
    return next(err);
  }
};

const getQueue = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const { items, meta } = await adminService.getQueue({
      type,
      status,
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
    });
    return sendSuccess(res, {
      status: 200,
      message: "Queue retrieved successfully",
      data: items,
      meta,
    });
  } catch (err) {
    return next(err);
  }
};

const reviewContent = async (req, res, next) => {
  try {
    const { contentType, id } = req.params;
    const { decision, feedback } = req.body;

    if (!decision || !["approved", "rejected"].includes(decision)) {
      return sendError(res, { status: 400, message: "decision must be 'approved' or 'rejected'" });
    }

    await adminService.reviewContent({
      contentType,
      contentId: id,
      reviewerId: req.user.id,
      decision,
      feedback,
    });

    return sendSuccess(res, {
      status: 200,
      message: `Content ${decision} successfully`,
    });
  } catch (err) {
    if (err.status) return sendError(res, { status: err.status, message: err.message });
    return next(err);
  }
};

const getReviewHistory = async (req, res, next) => {
  try {
    const { contentType, id } = req.params;
    const history = await adminService.getReviewHistory(contentType, id);
    return sendSuccess(res, {
      status: 200,
      message: "Review history retrieved successfully",
      data: history,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getQueue, getContentItem, reviewContent, getReviewHistory, getMySubmissions };
