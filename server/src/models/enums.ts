export const OPPORTUNITY_TYPES = [
  "grant_ngo",
  "grant_government",
  "angel_investment",
  "accelerator",
  "loan",
  "microfinance",
  "vc",
  "prize_money",
] as const;

export const LISTING_STATUSES = [
  "open",
  "rolling_applications",
  "closed",
] as const;

export const TRAINING_FORMATS = ["online", "in_person", "hybrid"] as const;

export const PROGRAMME_TYPES = [
  "accelerator",
  "bootcamp",
  "workshop",
  "online_course",
  "mentorship_programme",
] as const;

export const COST_TYPES = ["free", "paid", "sponsored"] as const;

export const DURATION_RANGES = [
  "lt_1_week",
  "1_4_weeks",
  "1_3_months",
  "3_plus_months",
  "self_paced",
] as const;

export const LOCATION_SCOPES = [
  "nigeria",
  "africa",
  "global",
  "online",
] as const;

export const INSTITUTION_TYPES = [
  "commercial_bank",
  "development_bank",
  "microfinance_bank",
  "fintech",
  "government",
  "ngo",
] as const;

export const CONTENT_TYPES = [
  "funding_opportunity",
  "training_programme",
  "guide",
  "template",
] as const;

export const REVIEW_DECISIONS = ["approved", "rejected"] as const;

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];
export type ListingStatus = (typeof LISTING_STATUSES)[number];
export type TrainingFormat = (typeof TRAINING_FORMATS)[number];
export type ProgrammeType = (typeof PROGRAMME_TYPES)[number];
export type CostType = (typeof COST_TYPES)[number];
export type DurationRange = (typeof DURATION_RANGES)[number];
export type LocationScope = (typeof LOCATION_SCOPES)[number];
export type InstitutionType = (typeof INSTITUTION_TYPES)[number];
export type ContentType = (typeof CONTENT_TYPES)[number];
export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];
