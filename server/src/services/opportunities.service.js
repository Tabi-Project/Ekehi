const supabase = require("../config/supabaseClient");
const { buildPaginationMeta, parseBool } = require("../utils/response.utils");

const FIELDS = [
  "id",
  "reference_code",
  "opportunity_title",
  "funder_name",
  "opportunity_type",
  "amount_min",
  "amount_max",
  "currency",
  "sectors",
  "stages",
  "country",
  "application_deadline",
  "status",
  "eligibility_criteria",
  "description",
  "apply_url",
  "contact_email",
  "is_women_only",
  "is_equity_free",
  "created_at",
].join(", ");

const getOpportunities = async ({
  search,
  opportunity_type,
  sector,
  stage,
  country,
  status,
  is_women_only,
  page = 1,
  limit = 10,
}) => {
  const offset = (page - 1) * limit;

  let query = supabase
    .from("funding_opportunities")
    .select(FIELDS, { count: "exact" })
    .eq("approval_status", "approved");

  if (search) {
    query = query.or(
      `opportunity_title.ilike.%${search}%,funder_name.ilike.%${search}%,description.ilike.%${search}%`,
    );
  }
  if (opportunity_type) query = query.eq("opportunity_type", opportunity_type);
  if (sector) query = query.contains("sectors", [sector]);
  if (stage) query = query.contains("stages", [stage]);
  if (country) query = query.eq("country", country);
  if (status) query = query.eq("status", status);
  const womenOnly = parseBool(is_women_only);
  if (womenOnly !== undefined) query = query.eq("is_women_only", womenOnly);

  query = query
    .range(offset, offset + limit - 1)
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

const getOpportunityById = async (id) => {
  const { data, error } = await supabase
    .from("funding_opportunities")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (error) throw error;
  return data;
};

const createOpportunity = async (submittedBy, fields) => {
  const { data, error } = await supabase
    .from("funding_opportunities")
    .insert({ ...fields, submitted_by: submittedBy, approval_status: "pending" })
    .select("id, reference_code, opportunity_title, approval_status")
    .single();

  if (error) throw error;
  return data;
};

const updateOpportunity = async (id, submittedBy, fields) => {
  const { data: existing, error: fetchError } = await supabase
    .from("funding_opportunities")
    .select("submitted_by, approval_status")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  if (!existing) throw Object.assign(new Error("Opportunity not found"), { status: 404 });
  if (existing.submitted_by !== submittedBy) {
    throw Object.assign(new Error("You can only edit your own submissions"), { status: 403 });
  }
  if (existing.approval_status === "approved") {
    throw Object.assign(new Error("Approved content cannot be edited"), { status: 403 });
  }

  const { data, error } = await supabase
    .from("funding_opportunities")
    .update({ ...fields, approval_status: "pending", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, reference_code, opportunity_title, approval_status")
    .single();

  if (error) throw error;
  return data;
};

const saveOpportunity = async (userId, opportunityId) => {
  const { error } = await supabase
    .from("saved_opportunities")
    .upsert(
      { user_id: userId, opportunity_id: opportunityId },
      { onConflict: "user_id,opportunity_id", ignoreDuplicates: true },
    );

  if (error) throw error;
};

const unsaveOpportunity = async (userId, opportunityId) => {
  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("user_id", userId)
    .eq("opportunity_id", opportunityId);

  if (error) throw error;
};

const getSavedOpportunities = async (userId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("saved_opportunities")
    .select(`created_at, funding_opportunities!inner(${FIELDS})`, { count: "exact" })
    .eq("user_id", userId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    items: data.map((row) => row.funding_opportunities),
    meta: buildPaginationMeta({ page: Number(page), limit: Number(limit), total: count }),
  };
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
