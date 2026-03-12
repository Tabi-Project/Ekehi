/**
 * Send a standardized success response.
 * @param {import('express').Response} res
 * @param {object} opts
 * @param {number}  [opts.status=200]
 * @param {string}  [opts.message='Success']
 * @param {*}       [opts.data=null]
 * @param {object}  [opts.meta=null]
 */
const sendSuccess = (
  res,
  { status = 200, message = "Success", data = null, meta = null } = {},
) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};

/**
 * Send a standardized error response.
 * @param {import('express').Response} res
 * @param {object} opts
 * @param {number} [opts.status=500]
 * @param {string} [opts.message='Internal server error']
 * @param {*}      [opts.data=null]
 */
const sendError = (
  res,
  { status = 500, message = "Internal server error", data = null } = {},
) => {
  return res.status(status).json({ success: false, message, data });
};

/**
 * Build pagination metadata for list responses.
 * @param {object} opts
 * @param {number} opts.page   - Current page (1-indexed)
 * @param {number} opts.limit  - Items per page
 * @param {number} opts.total  - Total matching rows
 */
const buildPaginationMeta = ({ page, limit, total }) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { sendSuccess, sendError, buildPaginationMeta };
