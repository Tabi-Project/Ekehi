const templatesService = require("../services/templates.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getTemplates = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const { items, meta } = await templatesService.getTemplates({
      search,
      category,
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
    });
    return sendSuccess(res, { status: 200, message: "Templates retrieved successfully", data: items, meta });
  } catch (err) {
    return next(err);
  }
};

const getTemplateById = async (req, res, next) => {
  try {
    const template = await templatesService.getTemplateById(req.params.id);
    if (!template) return sendError(res, { status: 404, message: "Template not found" });
    return sendSuccess(res, { status: 200, message: "Template retrieved successfully", data: template });
  } catch (err) {
    if (err.code === "PGRST116") return sendError(res, { status: 404, message: "Template not found" });
    return next(err);
  }
};

const createTemplate = async (req, res, next) => {
  try {
    const template = await templatesService.createTemplate(req.user.id, req.body);
    return sendSuccess(res, { status: 201, message: "Template submitted for review", data: template });
  } catch (err) {
    return next(err);
  }
};

const updateTemplate = async (req, res, next) => {
  try {
    const template = await templatesService.updateTemplate(req.params.id, req.user.id, req.body);
    return sendSuccess(res, { status: 200, message: "Template updated and resubmitted for review", data: template });
  } catch (err) {
    if (err.status) return sendError(res, { status: err.status, message: err.message });
    return next(err);
  }
};

module.exports = { getTemplates, getTemplateById, createTemplate, updateTemplate };
