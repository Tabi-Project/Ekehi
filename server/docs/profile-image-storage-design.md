# Profile Image Storage Design

## Overview

This document explains the design decisions behind how profile images are stored in the database and Supabase Storage, including the reasoning for a key change made during implementation.

---

## The Change: URL → Path

### Original Design

When `profile_image_url` was first added to the `profiles` table, the full public URL was stored directly:

```
profile_image_url: "https://xxx.supabase.co/storage/v1/object/public/ekehi-assets/profile-images/uuid/avatar.jpeg"
```

### Revised Design

The column was renamed to `profile_image_path` and now stores only the relative storage path:

```
profile_image_path: "profile-images/uuid/avatar.jpeg"
```

The full URL is derived at read time using Supabase's `getPublicUrl()`, which is a synchronous local operation (no network call — it just prepends your project URL).

---

## Why the Change Was Made

### 1. DB Bloat

The full URL is a long string (~100+ characters) that contains redundant information — the base URL (`https://xxx.supabase.co/storage/v1/object/public/ekehi-assets/`) is the same for every single row. Storing it per-row wastes space with no benefit.

### 2. Tight Coupling to Infrastructure

Storing the full URL ties the data to a specific bucket name, region, and Supabase project URL. If any of those change (bucket renamed, project migrated, CDN added in front), every stored URL breaks and requires a data migration to fix.

Storing only the path means the URL can always be correctly reconstructed regardless of infrastructure changes.

### 3. Orphaned Files on Extension Change

The original approach used `upsert: true` on upload, which works cleanly when the file extension stays the same. But if a user uploads a `.jpeg` and later uploads a `.png`, two files exist in storage:

```
profile-images/uuid/avatar.jpeg  ← orphaned
profile-images/uuid/avatar.png   ← active
```

By storing the path, we can retrieve the previous path from the DB before uploading and delete exactly the old file — no guessing, no accumulation of stale files.

---

## Current Implementation

### Storage Structure

```
ekehi-assets/
└── profile-images/
    └── <userId>/
        └── avatar.<ext>   (jpeg | png | webp)
```

One file per user. Re-uploading the same extension overwrites via `upsert: true`. Changing extension deletes the old file first.

### Upload Flow (Signup)

```
1. Create Supabase auth user → get user.id
2. If profileImage provided → uploadProfileImage(userId, file) → returns path
3. Insert profile row with profile_image_path = path (or null)
```

### Upload Flow (Profile Update)

```
1. Fetch current profile_image_path from DB
2. Upload new image → get new path
3. Update DB with new path
4. If old path exists and differs from new path → deleteImage(oldPath) [fire-and-forget]
5. Return profile with profile_image_url derived from new path
```

### API Response

Even though the DB stores a path, the API always returns `profile_image_url` (full URL) to clients. The path is an internal implementation detail.

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "Ada",
  "last_name": "Lovelace",
  "profile_image_url": "https://xxx.supabase.co/storage/v1/object/public/ekehi-assets/profile-images/uuid/avatar.jpeg",
  "role": "user"
}
```

---

## Pros and Cons

### Storing the Path (current approach)

| Pros                                                                    | Cons                                                                                              |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Smaller DB rows — path is ~40 chars vs ~120 for full URL                | Requires `getPublicUrl()` call on every read to reconstruct URL                                   |
| Infrastructure-independent — bucket/region/CDN changes don't break data | Slightly more code to manage (utility helper needed)                                              |
| Enables precise old-file deletion on extension change                   | Path must be kept consistent — renaming the bucket or folder structure still requires a migration |
| Single source of truth for URL construction (project URL in one place)  |                                                                                                   |
| Clean separation between storage path and access URL                    |                                                                                                   |

### Storing the Full URL (original approach)

| Pros                                                 | Cons                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| Simple — read and return directly, no transformation | URL baked into DB — infrastructure changes break all stored URLs |
| No utility helper needed                             | Row bloat — stores redundant base URL for every profile          |
|                                                      | Cannot safely delete old files when extension changes            |
|                                                      | Harder to bulk-update URLs if CDN or bucket changes              |

---

## Related Files

| File                                         | Role                                                                  |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `server/src/utils/storage.utils.js`          | `uploadProfileImage`, `getPublicImageUrl`, `deleteImage` helpers      |
| `server/src/services/auth.service.js`        | Calls `uploadProfileImage` during signup                              |
| `server/src/services/profile.service.js`     | Manages upload, delete, and URL reconstruction on profile update/read |
| `server/src/middleware/upload.middleware.js` | Multer config — memory storage, 5MB limit, JPEG/PNG/WebP only         |
