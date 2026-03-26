const supabase = require("../config/supabaseClient");

const BUCKET = "ekehi-assets";

/**
 * Uploads a profile image and returns the storage path (not the full URL).
 * Uses upsert so same-extension re-uploads overwrite cleanly.
 */
const uploadProfileImage = async (userId, { buffer, mimetype }) => {
  const ext = mimetype.split("/")[1];
  const path = `profile-images/${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimetype, upsert: true });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  return path;
};

/**
 * Derives the full public URL from a stored path.
 * getPublicUrl is synchronous — no network call.
 */
const getPublicImageUrl = (path) => {
  if (!path) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Deletes a file from storage. Fire-and-forget — errors are swallowed
 * since a failed delete should never block the user's response.
 */
const deleteImage = (path) => {
  if (!path) return;
  supabase.storage.from(BUCKET).remove([path]).catch(() => {});
};

module.exports = { uploadProfileImage, getPublicImageUrl, deleteImage };
