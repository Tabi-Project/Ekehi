import { HttpError } from "#/lib/http-error";
import { buildPaginationMeta } from "#/lib/response";
import { supabase } from "#/lib/supabase";
import type { Tables } from "#/types/database";
import type {
  CreateOpportunityInput,
  ListOpportunitiesQuery,
  UpdateOpportunityInput,
} from "#/modules/opportunities/opportunities.schema";

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

const NOT_FOUND_CODE = "PGRST116";

export async function getOpportunities({
  search,
  opportunity_type,
  sector,
  stage,
  country,
  status,
  is_women_only,
  page,
  limit,
}: ListOpportunitiesQuery) {
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
  if (is_women_only !== undefined) {
    query = query.eq("is_women_only", is_women_only);
  }

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    items: data,
    meta: buildPaginationMeta({ page, limit, total: count ?? 0 }),
  };
}

export async function getOpportunityById(id: string, userId?: string) {
  const { data, error } = await supabase
    .from("funding_opportunities")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (error) {
    if (error.code === NOT_FOUND_CODE) return null;
    throw error;
  }
  if (!data) return null;

  let is_saved = false;
  if (userId) {
    const { data: saved } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", userId)
      .eq("opportunity_id", id)
      .maybeSingle();
    is_saved = Boolean(saved);
  }

  return { ...data, is_saved };
}

export async function createOpportunity(
  submittedBy: string,
  fields: CreateOpportunityInput,
) {
  const { data, error } = await supabase
    .from("funding_opportunities")
    .insert({
      ...fields,
      submitted_by: submittedBy,
      approval_status: "pending",
    })
    .select("id, reference_code, opportunity_title, approval_status")
    .single();

  if (error) throw error;
  return data;
}

export async function updateOpportunity(
  id: string,
  submittedBy: string,
  fields: UpdateOpportunityInput,
) {
  const { data: existing, error: fetchError } = await supabase
    .from("funding_opportunities")
    .select("submitted_by, approval_status")
    .eq("id", id)
    .single();

  if (fetchError) {
    if (fetchError.code === NOT_FOUND_CODE) {
      throw new HttpError(404, "Opportunity not found");
    }
    throw fetchError;
  }
  if (existing.submitted_by !== submittedBy) {
    throw new HttpError(403, "You can only edit your own submissions");
  }
  if (existing.approval_status === "approved") {
    throw new HttpError(403, "Approved content cannot be edited");
  }

  const { data, error } = await supabase
    .from("funding_opportunities")
    .update({
      ...fields,
      approval_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, reference_code, opportunity_title, approval_status")
    .single();

  if (error) throw error;
  return data;
}

export async function saveOpportunity(userId: string, opportunityId: string) {
  const { error } = await supabase
    .from("saved_opportunities")
    .upsert(
      { user_id: userId, opportunity_id: opportunityId },
      { onConflict: "user_id,opportunity_id", ignoreDuplicates: true },
    );

  if (error) throw error;
}

export async function unsaveOpportunity(userId: string, opportunityId: string) {
  const { error } = await supabase
    .from("saved_opportunities")
    .delete()
    .eq("user_id", userId)
    .eq("opportunity_id", opportunityId);

  if (error) throw error;
}

export async function getSavedOpportunities(
  userId: string,
  { page, limit }: { page: number; limit: number },
) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("saved_opportunities")
    .select(`created_at, funding_opportunities!inner(${FIELDS})`, {
      count: "exact",
    })
    .eq("user_id", userId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // The joined select uses a dynamic field list, so the row type cannot be
  // inferred; cast to the known join shape using the generated table type.
  const rows = (data ?? []) as unknown as Array<{
    funding_opportunities: Tables<"funding_opportunities">;
  }>;
  const items = rows.map((row) => row.funding_opportunities);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total: count ?? 0 }),
  };
}
