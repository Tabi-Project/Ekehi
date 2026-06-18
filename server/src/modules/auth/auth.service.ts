import { HttpError } from "#/lib/http-error";
import { logger } from "#/lib/logger";
import { type ImageUpload, uploadProfileImage } from "#/lib/storage";
import { authClient, supabase } from "#/lib/supabase";
import type { LoginInput, SignupInput } from "#/modules/auth/auth.schema";

type SignupArgs = SignupInput & { profileImage: ImageUpload | null };

export async function signUp({
  email,
  password,
  firstName,
  lastName,
  profileImage,
}: SignupArgs) {
  const { data, error } = await authClient.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName } },
  });

  if (error) throw error;

  if (data.user) {
    let profileImagePath: string | null = null;

    if (profileImage) {
      try {
        profileImagePath = await uploadProfileImage(data.user.id, profileImage);
      } catch (uploadErr) {
        logger.warn(
          "Profile image upload failed during signup",
          uploadErr instanceof Error ? uploadErr.message : uploadErr,
        );
      }
    }

    // Best-effort profile row creation via service-role client (bypasses RLS).
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      profile_image_path: profileImagePath,
    });

    if (profileError) {
      logger.warn("Profile insert failed during signup", profileError.message);
    }
  }

  return data;
}

export async function signIn({ email, password }: LoginInput) {
  const { data, error } = await authClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message?.toLowerCase().includes("invalid login credentials")) {
      throw new HttpError(401, "Invalid email or password");
    }
    throw error;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const role = (profile?.role as string | undefined) ?? "user";
  return { ...data, role };
}

export async function signOut(accessToken: string) {
  const { error } = await supabase.auth.admin.signOut(accessToken);
  if (error) throw error;
}

export async function refreshSession(refreshToken: string) {
  const { data, error } = await authClient.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    throw new HttpError(401, "Invalid or expired refresh token");
  }

  return data.session;
}
