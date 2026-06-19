import type { SupabaseClient } from "@supabase/supabase-js";

import { HttpError } from "#/lib/http-error";
import { buildPaginationMeta } from "#/lib/response";
import { supabase } from "#/lib/supabase";
import type { ContentType } from "#/models/enums";
import type { QueueQuery, ReviewBody } from "#/modules/admin/admin.schema";

// Admin operates generically across content tables with dynamic table names and
// select strings, which the typed client cannot resolve. Use an untyped handle
// for these intentionally-dynamic queries.
const db = supabase as unknown as SupabaseClient;

const CONTENT_TABLES: Record<ContentType, string> = {
  funding_opportunity: "funding_opportunities",
  training_programme: "training_programmes",
  guide: "guides",
  template: "templates",
};

const QUEUE_FIELDS: Record<ContentType, string> = {
  funding_opportunity:
    "id, reference_code, opportunity_title, submitted_by, created_at, approval_status",
  training_programme:
    "id, reference_code, programme_name, submitted_by, created_at, approval_status",
  guide: "id, title, category, submitted_by, created_at, approval_status",
  template: "id, title, category, submitted_by, created_at, approval_status",
};

const ALL_CONTENT_TYPES = Object.keys(CONTENT_TABLES) as ContentType[];

/**
 * Fetch pending (or filtered) submissions across all or one content type.
 */
export async function getQueue({ type, status, page, limit }: QueueQuery) {
  const offset = (page - 1) * limit;
  const types = type ? [type] : ALL_CONTENT_TYPES;

  const results = await Promise.all(
    types.map(async (contentType) => {
      const table = CONTENT_TABLES[contentType];
      const fields = QUEUE_FIELDS[contentType];

      const { data, error, count } = await db
        .from(table)
        .select(
          `${fields}, profiles!submitted_by(first_name, last_name, email)`,
          { count: "exact" },
        )
        .eq("approval_status", status)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return {
        items: ((data ?? []) as unknown as Record<string, unknown>[]).map(
          (row) => ({ ...row, content_type: contentType }),
        ),
        count: count ?? 0,
      };
    }),
  );

  const items = results.flatMap((result) => result.items);
  const total = results.reduce((sum, result) => sum + result.count, 0);

  return {
    items,
    meta: buildPaginationMeta({ page, limit, total }),
  };
}

/**
 * Approve or reject content: update approval_status and write an audit record.
 * Feedback is required when rejecting.
 */
export async function reviewContent({
  contentType,
  contentId,
  reviewerId,
  decision,
  feedback,
}: {
  contentType: ContentType;
  contentId: string;
  reviewerId: string;
  decision: ReviewBody["decision"];
  feedback?: string;
}) {
  const table = CONTENT_TABLES[contentType];

  if (decision === "rejected" && !feedback?.trim()) {
    throw new HttpError(400, "Feedback is required when rejecting content");
  }

  const { error: updateError } = await db
    .from(table)
    .update({ approval_status: decision, updated_at: new Date().toISOString() })
    .eq("id", contentId);

  if (updateError) throw updateError;

  const { error: reviewError } = await db.from("content_reviews").insert({
    content_type: contentType,
    content_id: contentId,
    reviewer_id: reviewerId,
    decision,
    feedback: feedback ?? null,
  });

  if (reviewError) throw reviewError;
}

export async function getReviewHistory(
  contentType: ContentType,
  contentId: string,
) {
  const { data, error } = await db
    .from("content_reviews")
    .select(
      "id, decision, feedback, created_at, profiles!reviewer_id(first_name, last_name, email)",
    )
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch a single content item by ID regardless of approval_status, so admins
 * can review pending items.
 */
export async function getContentItem(
  contentType: ContentType,
  contentId: string,
) {
  const table = CONTENT_TABLES[contentType];

  const { data, error } = await db
    .from(table)
    .select("*, profiles!submitted_by(first_name, last_name, email)")
    .eq("id", contentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new HttpError(404, "Not found");
    throw error;
  }
  return data;
}

type Submission = Record<string, unknown> & { content_type: ContentType };

export async function getMySubmissions(userId: string) {
  const results = await Promise.all(
    ALL_CONTENT_TYPES.map(async (contentType): Promise<Submission[]> => {
      const table = CONTENT_TABLES[contentType];
      const fields = QUEUE_FIELDS[contentType];

      const { data, error } = await db
        .from(table)
        .select(fields)
        .eq("submitted_by", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return ((data ?? []) as unknown as Record<string, unknown>[]).map(
        (row) => ({ ...row, content_type: contentType }) as Submission,
      );
    }),
  );

  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(String(b.created_at)).getTime() -
        new Date(String(a.created_at)).getTime(),
    );
}

export async function deleteContent(
  contentType: ContentType,
  contentId: string,
) {
  const table = CONTENT_TABLES[contentType];

  const { error } = await db.from(table).delete().eq("id", contentId);
  if (error) throw error;
}
