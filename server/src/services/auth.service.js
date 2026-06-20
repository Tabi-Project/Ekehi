const { createClient } = require("@supabase/supabase-js");
const supabase = require("../config/supabaseClient");
const { supabaseUrl, supabaseAnonKey } = require("../config/env");
const { uploadProfileImage } = require("../utils/storage.utils");

// Separate client for user-facing auth operations (anon key).
// Must NOT be the service role singleton — signInWithPassword sets an in-memory
// session on the client, which would contaminate the singleton and cause all
// subsequent DB queries to use the user JWT instead of the service role key,
// making RLS apply and returning empty results on public endpoints.
const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const signUp = async ({ email, password, firstName, lastName, profileImage }) => {
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) throw error;

  if (data.user) {
    let profileImagePath = null;

    if (profileImage) {
      try {
        profileImagePath = await uploadProfileImage(data.user.id, profileImage);
      } catch (uploadErr) {
        console.warn("[auth.service] Profile image upload failed:", uploadErr.message);
      }
    }

    // Best-effort profile creation via service role client (bypasses RLS)
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      profile_image_path: profileImagePath,
    });

    if (profileError) {
      console.warn(
        "[auth.service] Profile insert failed:",
        profileError.message,
      );
    }
  }

  return data;
};

const signIn = async ({ email, password }) => {
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return { ...data, role: profile?.role ?? "user" };
};

const signOut = async (accessToken) => {
  // Use admin API on the service role client to invalidate the session
  const { error } = await supabase.auth.admin.signOut(accessToken);
  if (error) throw error;
};

const refreshSession = async (refreshToken) => {
  const { data, error } = await authClient.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (error) throw error;
  return data;
};

module.exports = { signUp, signIn, signOut, refreshSession };
