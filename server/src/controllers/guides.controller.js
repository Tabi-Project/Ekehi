const guidesService = require("../services/guides.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getGuides = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const { items, meta } = await guidesService.getGuides({
      search,
      category,
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
    });
    return sendSuccess(res, { status: 200, message: "Guides retrieved successfully", data: items, meta });
  } catch (err) {
    return next(err);
  }
};

const getGuideById = async (req, res, next) => {
  try {
    const guide = await guidesService.getGuideById(req.params.id);
    if (!guide) return sendError(res, { status: 404, message: "Guide not found" });
    return sendSuccess(res, { status: 200, message: "Guide retrieved successfully", data: guide });
  } catch (err) {
    if (err.code === "PGRST116") return sendError(res, { status: 404, message: "Guide not found" });
    return next(err);
  }
};

const createGuide = async (req, res, next) => {
  try {
    const guide = await guidesService.createGuide(req.user.id, req.body);
    return sendSuccess(res, { status: 201, message: "Guide submitted for review", data: guide });
  } catch (err) {
    return next(err);
  }
};

const updateGuide = async (req, res, next) => {
  try {
    const guide = await guidesService.updateGuide(req.params.id, req.user.id, req.body);
    return sendSuccess(res, { status: 200, message: "Guide updated and resubmitted for review", data: guide });
  } catch (err) {
    if (err.status) return sendError(res, { status: err.status, message: err.message });
    return next(err);
  }
};

module.exports = { getGuides, getGuideById, createGuide, updateGuide };
