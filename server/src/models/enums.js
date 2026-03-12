const OPPORTUNITY_TYPES = [
  "grant_ngo",
  "grant_government",
  "angel_investment",
  "accelerator",
  "loan",
  "microfinance",
  "vc",
  "prize_money",
];

const LISTING_STATUSES = ["open", "rolling_applications", "closed"];

const TRAINING_FORMATS = ["online", "in_person", "hybrid"];

const PROGRAMME_TYPES = [
  "accelerator",
  "bootcamp",
  "workshop",
  "online_course",
  "mentorship_programme",
];

const COST_TYPES = ["free", "paid", "sponsored"];

const DURATION_RANGES = [
  "lt_1_week",
  "1_4_weeks",
  "1_3_months",
  "3_plus_months",
  "self_paced",
];

const LOCATION_SCOPES = ["nigeria", "africa", "global", "online"];

const INSTITUTION_TYPES = [
  "commercial_bank",
  "development_bank",
  "microfinance_bank",
  "fintech",
  "government",
  "ngo",
];

module.exports = {
  OPPORTUNITY_TYPES,
  LISTING_STATUSES,
  TRAINING_FORMATS,
  PROGRAMME_TYPES,
  COST_TYPES,
  DURATION_RANGES,
  LOCATION_SCOPES,
  INSTITUTION_TYPES,
};
