import { HttpError } from "#/lib/http-error";
import { buildPaginationMeta } from "#/lib/response";
import { supabase } from "#/lib/supabase";
import type {
  CreateTemplateInput,
  ListTemplatesQuery,
  UpdateTemplateInput,
} from "#/modules/templates/templates.schema";

const NOT_FOUND_CODE = "PGRST116";

export async function getTemplates({
  search,
  category,
  page,
  limit,
}: ListTemplatesQuery) {
  const offset = (page - 1) * limit;

  let query = supabase
    .from("templates")
    .select("id, title, description, category, file_url, created_at", {
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

export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from("templates")
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

export async function createTemplate(
  submittedBy: string,
  fields: CreateTemplateInput,
) {
  const { data, error } = await supabase
    .from("templates")
    .insert({
      ...fields,
      submitted_by: submittedBy,
      approval_status: "pending",
    })
    .select("id, title, approval_status")
    .single();

  if (error) throw error;
  return data;
}

export async function updateTemplate(
  id: string,
  submittedBy: string,
  fields: UpdateTemplateInput,
) {
  const { data: existing, error: fetchError } = await supabase
    .from("templates")
    .select("submitted_by, approval_status")
    .eq("id", id)
    .single();

  if (fetchError) {
    if (fetchError.code === NOT_FOUND_CODE) {
      throw new HttpError(404, "Template not found");
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
    .from("templates")
    .update({
      ...fields,
      approval_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, title, approval_status")
    .single();

  if (error) throw error;
  return data;
}
