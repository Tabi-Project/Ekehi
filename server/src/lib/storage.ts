import { HttpError } from "#/lib/http-error";
import { logger } from "#/lib/logger";
import { supabase } from "#/lib/supabase";

const BUCKET = "ekehi-assets";

export type ImageUpload = {
  buffer: Buffer;
  mimetype: string;
};

/**
 * Uploads a profile image and returns the storage path (not the full URL).
 * Uses upsert so same-extension re-uploads overwrite cleanly.
 */
export async function uploadProfileImage(
  userId: string,
  { buffer, mimetype }: ImageUpload,
): Promise<string> {
  const ext = mimetype.split("/")[1] ?? "bin";
  const path = `profile-images/${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: mimetype, upsert: true });

  if (error) {
    throw new HttpError(500, `Image upload failed: ${error.message}`);
  }

  return path;
}

/**
 * Derives the full public URL from a stored path. Synchronous — no network call.
 */
export function getPublicImageUrl(path: string | null): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Deletes a file from storage. Fire-and-forget — errors are swallowed since a
 * failed delete should never block the user's response.
 */
export function deleteImage(path: string | null): void {
  if (!path) return;
  supabase.storage
    .from(BUCKET)
    .remove([path])
    .then(({ error }) => {
      if (error) logger.warn("Storage delete failed", error.message);
    })
    .catch(() => {
      /* swallowed: non-blocking cleanup */
    });
}
