const supabase = require("../config/supabaseClient");
const { buildPaginationMeta } = require("../utils/response.utils");

const CONTENT_TABLES = {
  funding_opportunity: "funding_opportunities",
  training_programme: "training_programmes",
  guide: "guides",
  template: "templates",
};

const QUEUE_FIELDS = {
  funding_opportunity: "id, reference_code, opportunity_title, submitted_by, created_at, approval_status",
  training_programme: "id, reference_code, programme_name, submitted_by, created_at, approval_status",
  guide: "id, title, category, submitted_by, created_at, approval_status",
  template: "id, title, category, submitted_by, created_at, approval_status",
};

/**
 * Fetch pending submissions across all (or one) content types.
 * Uses partial indexes on approval_status = 'pending' for each table.
 */
const getQueue = async ({ type, status = "pending", page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;
  const types = type ? [type] : Object.keys(CONTENT_TABLES);

  const results = await Promise.all(
    types.map(async (contentType) => {
      const table = CONTENT_TABLES[contentType];
      const fields = QUEUE_FIELDS[contentType];

      const { data, error, count } = await supabase
        .from(table)
        .select(`${fields}, profiles!submitted_by(first_name, last_name, email)`, { count: "exact" })
        .eq("approval_status", status)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return {
        items: (data ?? []).map((row) => ({ ...row, content_type: contentType })),
        count: count ?? 0,
      };
    }),
  );

  const items = results.flatMap((r) => r.items);
  const total = results.reduce((sum, r) => sum + r.count, 0);

  return {
    items,
    meta: buildPaginationMeta({ page: Number(page), limit: Number(limit), total }),
  };
};

/**
 * Approve or reject a piece of content.
 * - Updates approval_status on the content table
 * - Writes a record to content_reviews for audit trail
 * - feedback is required when decision = 'rejected'
 */
const reviewContent = async ({ contentType, contentId, reviewerId, decision, feedback }) => {
  const table = CONTENT_TABLES[contentType];
  if (!table) throw Object.assign(new Error("Invalid content type"), { status: 400 });

  if (decision === "rejected" && !feedback?.trim()) {
    throw Object.assign(new Error("Feedback is required when rejecting content"), { status: 400 });
  }

  const { error: updateError } = await supabase
    .from(table)
    .update({ approval_status: decision, updated_at: new Date().toISOString() })
    .eq("id", contentId);

  if (updateError) throw updateError;

  const { error: reviewError } = await supabase
    .from("content_reviews")
    .insert({
      content_type: contentType,
      content_id: contentId,
      reviewer_id: reviewerId,
      decision,
      feedback: feedback ?? null,
    });

  if (reviewError) throw reviewError;
};

/**
 * Fetch the full review history for a single piece of content.
 */
const getReviewHistory = async (contentType, contentId) => {
  const { data, error } = await supabase
    .from("content_reviews")
    .select("id, decision, feedback, created_at, profiles!reviewer_id(first_name, last_name, email)")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetch a single content item by ID regardless of approval_status.
 * Used by the admin review page so pending items are visible.
 */
const getContentItem = async (contentType, contentId) => {
  const table = CONTENT_TABLES[contentType];
  if (!table) throw Object.assign(new Error("Invalid content type"), { status: 400 });

  const { data, error } = await supabase
    .from(table)
    .select(`*, profiles!submitted_by(first_name, last_name, email)`)
    .eq("id", contentId)
    .single();

  if (error) throw error;
  if (!data) throw Object.assign(new Error("Not found"), { status: 404 });
  return data;
};

/**
 * Fetch all submissions by a specific user across all content types.
 */
const getMySubmissions = async (userId) => {
  const results = await Promise.all(
    Object.entries(CONTENT_TABLES).map(async ([contentType, table]) => {
      const fields = QUEUE_FIELDS[contentType];

      const { data, error } = await supabase
        .from(table)
        .select(fields)
        .eq("submitted_by", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row) => ({ ...row, content_type: contentType }));
    }),
  );

  return results.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const deleteContent = async (contentType, contentId) => {
  const table = CONTENT_TABLES[contentType];
  if (!table) throw Object.assign(new Error("Invalid content type"), { status: 400 });

  const { error } = await supabase.from(table).delete().eq("id", contentId);
  if (error) throw error;
};

module.exports = { getQueue, getContentItem, reviewContent, getReviewHistory, getMySubmissions, deleteContent };
