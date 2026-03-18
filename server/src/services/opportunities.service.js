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

module.exports = { getOpportunities, getOpportunityById };
