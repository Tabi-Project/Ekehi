const supabase = require("../config/supabaseClient");

const updateProfile = async ({ userId, fields, profileImage }) => {
  const updates = {};

  if (fields.firstName !== undefined) updates.first_name = fields.firstName;
  if (fields.lastName !== undefined) updates.last_name = fields.lastName;

  if (profileImage) {
    const ext = profileImage.mimetype.split("/")[1];
    const storagePath = `profile-images/${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("ekehi-assets")
      .upload(storagePath, profileImage.buffer, {
        contentType: profileImage.mimetype,
        upsert: true,
      });

    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage
      .from("ekehi-assets")
      .getPublicUrl(storagePath);

    updates.profile_image_url = urlData.publicUrl;
  }

  if (Object.keys(updates).length === 0) {
    throw Object.assign(new Error("No fields provided to update"), { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id, email, first_name, last_name, profile_image_url, role, updated_at")
    .single();

  if (error) throw error;
  return data;
};

const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, profile_image_url, role, created_at, updated_at")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

module.exports = { updateProfile, getProfile };
