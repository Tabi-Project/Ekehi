const opportunitiesService = require("../services/opportunities.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getOpportunities = async (req, res, next) => {
  try {
    const {
      search,
      opportunity_type,
      sector,
      stage,
      country,
      status,
      is_women_only,
      page = 1,
      limit = 10,
    } = req.query;

    const { items, meta } = await opportunitiesService.getOpportunities({
      search,
      opportunity_type,
      sector,
      stage,
      country,
      status,
      is_women_only,
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
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
    const { id } = req.params;
    const opportunity = await opportunitiesService.getOpportunityById(id);

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

module.exports = { getOpportunities, getOpportunityById };
