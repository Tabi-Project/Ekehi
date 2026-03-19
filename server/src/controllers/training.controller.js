const trainingService = require("../services/training.service");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getTrainingProgrammes = async (req, res, next) => {
  try {
    const {
      search,
      programme_type,
      format,
      cost_type,
      duration_range,
      location_scope,
      is_featured,
      page = 1,
      limit = 10,
    } = req.query;

    const { items, meta } = await trainingService.getTrainingProgrammes({
      search,
      programme_type,
      format,
      cost_type,
      duration_range,
      location_scope,
      is_featured,
      page: Math.max(1, Number(page)),
      limit: Math.min(100, Math.max(1, Number(limit))),
    });

    return sendSuccess(res, {
      status: 200,
      message: "Training programmes retrieved successfully",
      data: items,
      meta,
    });
  } catch (err) {
    return next(err);
  }
};

const getTrainingProgrammeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const programme = await trainingService.getTrainingProgrammeById(id);

    if (!programme) {
      return sendError(res, {
        status: 404,
        message: "Training programme not found",
      });
    }

    return sendSuccess(res, {
      status: 200,
      message: "Training programme retrieved successfully",
      data: programme,
    });
  } catch (err) {
    if (err.code === "PGRST116") {
      return sendError(res, {
        status: 404,
        message: "Training programme not found",
      });
    }
    return next(err);
  }
};

const createTraining = async (req, res, next) => {
  try {
    const training = await trainingService.createTraining(req.user.id, req.body);
    return sendSuccess(res, { status: 201, message: "Training submitted for review", data: training });
  } catch (err) {
    return next(err);
  }
};

const updateTraining = async (req, res, next) => {
  try {
    const training = await trainingService.updateTraining(req.params.id, req.user.id, req.body);
    return sendSuccess(res, { status: 200, message: "Training updated and resubmitted for review", data: training });
  } catch (err) {
    if (err.status) return sendError(res, { status: err.status, message: err.message });
    return next(err);
  }
};

module.exports = { getTrainingProgrammes, getTrainingProgrammeById, createTraining, updateTraining };
