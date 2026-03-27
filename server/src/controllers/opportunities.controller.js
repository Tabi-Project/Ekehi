const opportunitiesService = require("../services/opportunities.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

function parsePagination({ page = 1, limit = 10 }) {
  return {
    page: Math.max(1, Number(page)),
    limit: Math.min(100, Math.max(1, Number(limit))),
  };
}

const getOpportunities = async (req, res, next) => {
  try {
    const { search, opportunity_type, sector, stage, country, status, is_women_only } = req.query;

    const { items, meta } = await opportunitiesService.getOpportunities({
      search,
      opportunity_type,
      sector,
      stage,
      country,
      status,
      is_women_only,
      ...parsePagination(req.query),
    });

    return sendSuccess(res, {
      status: 200,
      message: "Opportunities retrieved successfully",
      data: items,
      meta,
    });
  } catch (err) {
    return next(err);
  }
};

const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await opportunitiesService.getOpportunityById(req.params.id, req.user?.id);

    if (!opportunity) {
      return sendError(res, { status: 404, message: "Opportunity not found" });
    }

    return sendSuccess(res, {
      status: 200,
      message: "Opportunity retrieved successfully",
      data: opportunity,
    });
  } catch (err) {
    if (err.code === "PGRST116") {
      return sendError(res, { status: 404, message: "Opportunity not found" });
    }
    return next(err);
  }
};

const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunitiesService.createOpportunity(req.user.id, req.body);
    return sendSuccess(res, { status: 201, message: "Opportunity submitted for review", data: opportunity });
  } catch (err) {
    return next(err);
  }
};

const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunitiesService.updateOpportunity(req.params.id, req.user.id, req.body);
    return sendSuccess(res, { status: 200, message: "Opportunity updated and resubmitted for review", data: opportunity });
  } catch (err) {
    if (err.status) return sendError(res, { status: err.status, message: err.message });
    return next(err);
  }
};

const saveOpportunity = async (req, res, next) => {
  try {
    await opportunitiesService.saveOpportunity(req.user.id, req.params.id);
    return sendSuccess(res, { status: 200, message: "Opportunity saved" });
  } catch (err) {
    return next(err);
  }
};

const unsaveOpportunity = async (req, res, next) => {
  try {
    await opportunitiesService.unsaveOpportunity(req.user.id, req.params.id);
    return sendSuccess(res, { status: 200, message: "Opportunity removed from saved" });
  } catch (err) {
    return next(err);
  }
};

const getSavedOpportunities = async (req, res, next) => {
  try {
    const { items, meta } = await opportunitiesService.getSavedOpportunities(
      req.user.id,
      parsePagination(req.query),
    );
    return sendSuccess(res, {
      status: 200,
      message: "Saved opportunities retrieved successfully",
      data: items,
      meta,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  saveOpportunity,
  unsaveOpportunity,
  getSavedOpportunities,
};
