const supabase = require("../config/supabaseClient");
const { uploadProfileImage, getPublicImageUrl, deleteImage } = require("../utils/storage.utils");

const updateProfile = async ({ userId, fields, profileImage }) => {
  const updates = {};

  if (fields.firstName !== undefined) updates.first_name = fields.firstName;
  if (fields.lastName !== undefined) updates.last_name = fields.lastName;

  if (profileImage) {
    // Fetch current path to delete old file after upload if extension changed
    const { data: current } = await supabase
      .from("profiles")
      .select("profile_image_path")
      .eq("id", userId)
      .single();

    const newPath = await uploadProfileImage(userId, profileImage);
    updates.profile_image_path = newPath;

    const oldPath = current?.profile_image_path;
    if (oldPath && oldPath !== newPath) {
      deleteImage(oldPath); // fire-and-forget, doesn't block response
    }
  }

  if (Object.keys(updates).length === 0) {
    throw Object.assign(new Error("No fields provided to update"), { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id, email, first_name, last_name, profile_image_path, role, updated_at")
    .single();

  if (error) throw error;

  return { ...data, profile_image_url: getPublicImageUrl(data.profile_image_path) };
};

const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, profile_image_path, role, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return { ...data, profile_image_url: getPublicImageUrl(data.profile_image_path) };
};

module.exports = { updateProfile, getProfile };
