const supabase = require("../config/supabaseClient");
const { buildPaginationMeta } = require("../utils/response.utils");

const getTemplates = async ({ search, category, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  let query = supabase
    .from("templates")
    .select("id, title, description, category, file_url, created_at", { count: "exact" })
    .eq("approval_status", "approved");

  if (search) query = query.ilike("title", `%${search}%`);
  if (category) query = query.eq("category", category);

  query = query.range(offset, offset + limit - 1).order("created_at", { ascending: false });

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    items: data,
    meta: buildPaginationMeta({ page: Number(page), limit: Number(limit), total: count }),
  };
};

const getTemplateById = async (id) => {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (error) throw error;
  return data;
};

const createTemplate = async (submittedBy, fields) => {
  const { data, error } = await supabase
    .from("templates")
    .insert({ ...fields, submitted_by: submittedBy, approval_status: "pending" })
    .select("id, title, approval_status")
    .single();

  if (error) throw error;
  return data;
};

const updateTemplate = async (id, submittedBy, fields) => {
  const { data: existing, error: fetchError } = await supabase
    .from("templates")
    .select("submitted_by, approval_status")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  if (!existing) throw Object.assign(new Error("Template not found"), { status: 404 });
  if (existing.submitted_by !== submittedBy) {
    throw Object.assign(new Error("You can only edit your own submissions"), { status: 403 });
  }
  if (existing.approval_status === "approved") {
    throw Object.assign(new Error("Approved content cannot be edited"), { status: 403 });
  }

  const { data, error } = await supabase
    .from("templates")
    .update({ ...fields, approval_status: "pending", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, title, approval_status")
    .single();

  if (error) throw error;
  return data;
};

module.exports = { getTemplates, getTemplateById, createTemplate, updateTemplate };
