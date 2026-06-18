import { HttpError } from "#/lib/http-error";
import { buildPaginationMeta } from "#/lib/response";
import { supabase } from "#/lib/supabase";
import type {
  CreateGuideInput,
  ListGuidesQuery,
  UpdateGuideInput,
} from "#/modules/guides/guides.schema";

const NOT_FOUND_CODE = "PGRST116";

export async function getGuides({
  search,
  category,
  page,
  limit,
}: ListGuidesQuery) {
  const offset = (page - 1) * limit;

  let query = supabase
    .from("guides")
    .select("id, title, slug, summary, category, created_at", {
      count: "exact",
    })
    .eq("approval_status", "approved");

  if (search) query = query.ilike("title", `%${search}%`);
  if (category) query = query.eq("category", category);

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    items: data,
    meta: buildPaginationMeta({ page, limit, total: count ?? 0 }),
  };
}

export async function getGuideById(id: string) {
  const { data, error } = await supabase
    .from("guides")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single();

  if (error) {
    if (error.code === NOT_FOUND_CODE) return null;
    throw error;
  }
  return data;
}

export async function createGuide(
  submittedBy: string,
  fields: CreateGuideInput,
) {
  const { data, error } = await supabase
    .from("guides")
    .insert({
      ...fields,
      submitted_by: submittedBy,
      approval_status: "pending",
    })
    .select("id, title, slug, approval_status")
    .single();

  if (error) throw error;
  return data;
}

export async function updateGuide(
  id: string,
  submittedBy: string,
  fields: UpdateGuideInput,
) {
  const { data: existing, error: fetchError } = await supabase
    .from("guides")
    .select("submitted_by, approval_status")
    .eq("id", id)
    .single();

  if (fetchError) {
    if (fetchError.code === NOT_FOUND_CODE) {
      throw new HttpError(404, "Guide not found");
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
    .from("guides")
    .update({
      ...fields,
      approval_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, title, slug, approval_status")
    .single();

  if (error) throw error;
  return data;
}
