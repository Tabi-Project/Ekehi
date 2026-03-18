const supabase = require("../config/supabaseClient");
const { buildPaginationMeta, parseBool } = require("../utils/response.utils");

const FIELDS = [
  "id",
  "reference_code",
  "programme_name",
  "provider",
  "programme_type",
  "format",
  "duration_range",
  "cost",
  "currency",
  "cost_type",
  "certification",
  "topics_covered",
  "location",
  "location_scope",
  "application_deadline",
  "apply_url",
  "is_featured",
  "description",
  "created_at",
].join(", ");

const getTrainingProgrammes = async ({
  search,
  programme_type,
  format,
  cost_type,
  duration_range,
  location_scope,
  is_featured,
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit;

  let query = supabase
    .from("training_programmes")
    .select(FIELDS, { count: "exact" })
    .eq("approval_status", "approved");

  if (search) {
    query = query.or(
      `programme_name.ilike.%${search}%,provider.ilike.%${search}%,description.ilike.%${search}%,topics_covered.ilike.%${search}%`,
    );
  }
  if (programme_type) query = query.eq("programme_type", programme_type);
  if (format) query = query.eq("format", format);
  if (cost_type) query = query.eq("cost_type", cost_type);
  if (duration_range) query = query.eq("duration_range", duration_range);
  if (location_scope) query = query.eq("location_scope", location_scope);
  const featured = parseBool(is_featured);
  if (featured !== undefined) query = query.eq("is_featured", featured);

  query = query
    .range(offset, offset + limit - 1)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    items: data,
    meta: buildPaginationMeta({
      page: Number(page),
      limit: Number(limit),
      total: count,
    }),
  };
};

const getTrainingProgrammeById = async (id) => {
  const { data, error } = await supabase
    .from("training_programmes")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (error) throw error;
  return data;
};

module.exports = { getTrainingProgrammes, getTrainingProgrammeById };
