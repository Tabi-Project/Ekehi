import { HttpError } from "#/lib/http-error";
import {
  deleteImage,
  getPublicImageUrl,
  type ImageUpload,
  uploadProfileImage,
} from "#/lib/storage";
import { supabase } from "#/lib/supabase";
import type { UpdateProfileInput } from "#/modules/profile/profile.schema";

// Generic over the selected profile shape so the precise row type inferred by
// the typed Supabase client flows through unchanged (plus the derived URL).
function withImageUrl<T extends { profile_image_path: string | null }>(
  profile: T,
) {
  return {
    ...profile,
    profile_image_url: getPublicImageUrl(profile.profile_image_path),
  };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, email, first_name, last_name, profile_image_path, role, created_at, updated_at",
    )
    .eq("id", userId)
    .single();

  if (error) throw error;

  return withImageUrl(data);
}

export async function updateProfile({
  userId,
  fields,
  profileImage,
}: {
  userId: string;
  fields: UpdateProfileInput;
  profileImage: ImageUpload | null;
}) {
  const updates: {
    first_name?: string;
    last_name?: string;
    profile_image_path?: string;
    updated_at?: string;
  } = {};

  if (fields.firstName !== undefined) updates.first_name = fields.firstName;
  if (fields.lastName !== undefined) updates.last_name = fields.lastName;

  if (profileImage) {
    // Fetch current path so the old file can be removed if the extension changes.
    const { data: current } = await supabase
      .from("profiles")
      .select("profile_image_path")
      .eq("id", userId)
      .single();

    const newPath = await uploadProfileImage(userId, profileImage);
    updates.profile_image_path = newPath;

    const oldPath = (current?.profile_image_path as string | null) ?? null;
    if (oldPath && oldPath !== newPath) {
      deleteImage(oldPath); // fire-and-forget, does not block the response
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, "No fields provided to update");
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select(
      "id, email, first_name, last_name, profile_image_path, role, updated_at",
    )
    .single();

  if (error) throw error;

  return withImageUrl(data);
}
