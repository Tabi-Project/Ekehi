import { HttpError } from "#/lib/http-error";
import { buildPaginationMeta } from "#/lib/response";
import { supabase } from "#/lib/supabase";
import type {
  CreateTrainingInput,
  ListTrainingsQuery,
  UpdateTrainingInput,
} from "#/modules/trainings/trainings.schema";

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

const NOT_FOUND_CODE = "PGRST116";

export async function getTrainingProgrammes({
  search,
  programme_type,
  format,
  cost_type,
  duration_range,
  location_scope,
  is_featured,
  page,
  limit,
}: ListTrainingsQuery) {
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
  if (is_featured !== undefined) query = query.eq("is_featured", is_featured);

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return {
    items: data,
    meta: buildPaginationMeta({ page, limit, total: count ?? 0 }),
  };
}

export async function getTrainingProgrammeById(id: string) {
  const { data, error } = await supabase
    .from("training_programmes")
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

export async function createTraining(
  submittedBy: string,
  fields: CreateTrainingInput,
) {
  // training_programmes has no DB defaults for id/created_at/updated_at, so the
  // service supplies them (unlike the other content tables).
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("training_programmes")
    .insert({
      ...fields,
      id: crypto.randomUUID(),
      submitted_by: submittedBy,
      approval_status: "pending",
      created_at: now,
      updated_at: now,
    })
    .select("id, reference_code, programme_name, approval_status")
    .single();

  if (error) throw error;
  return data;
}

export async function updateTraining(
  id: string,
  submittedBy: string,
  fields: UpdateTrainingInput,
) {
  const { data: existing, error: fetchError } = await supabase
    .from("training_programmes")
    .select("submitted_by, approval_status")
    .eq("id", id)
    .single();

  if (fetchError) {
    if (fetchError.code === NOT_FOUND_CODE) {
      throw new HttpError(404, "Training not found");
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
    .from("training_programmes")
    .update({
      ...fields,
      approval_status: "pending",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, reference_code, programme_name, approval_status")
    .single();

  if (error) throw error;
  return data;
}
