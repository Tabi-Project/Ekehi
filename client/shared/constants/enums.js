/**
 * enums.js — Display label maps for all API enum slugs.
 *
 * Usage:
 *   <script src="/shared/constants/enums.js"></script>
 *
 *   EKEHI_ENUMS.opportunityType['grant_ngo']   // → "Grant (NGO / Foundation)"
 *   EKEHI_ENUMS.durationRange['1_4_weeks']     // → "1-4 weeks"
 */

const EKEHI_ENUMS = {
  opportunityType: {
    grant_ngo: "Grant (NGO / Foundation)",
    grant_government: "Grant (Government)",
    angel_investment: "Angel Investment",
    accelerator: "Accelerator",
    loan: "Loan / Credit Facility",
    microfinance: "Microfinance",
    vc: "Venture Capital",
    prize_money: "Prize Money",
  },

  listingStatus: {
    open: "Open",
    rolling_applications: "Rolling Applications",
    closed: "Closed",
  },

  trainingFormat: {
    online: "Online",
    in_person: "In-Person",
    hybrid: "Hybrid",
  },

  programmeType: {
    accelerator: "Accelerator",
    bootcamp: "Bootcamp",
    workshop: "Workshop",
    online_course: "Online Course",
    mentorship_programme: "Mentorship Programme",
  },

  costType: {
    free: "Free",
    paid: "Paid",
    sponsored: "Sponsored",
  },

  durationRange: {
    lt_1_week: "< 1 week",
    "1_4_weeks": "1-4 weeks",
    "1_3_months": "1-3 months",
    "3_plus_months": "3+ months",
    self_paced: "Self-paced",
  },

  locationScope: {
    nigeria: "Nigeria",
    africa: "Africa",
    global: "Global",
    online: "Online",
  },

  sector: {
    agriculture_food: "Agriculture & Food Processing",
    beauty_personal_care: "Beauty & Personal Care",
    creative_industries: "Creative Industries",
    education_edtech: "Education & EdTech",
    fashion_textiles: "Fashion & Textiles",
    financial_services_fintech: "Financial Services & Fintech",
    health_wellness: "Health & Wellness",
    logistics_distribution: "Logistics & Distribution",
    retail_ecommerce: "Retail & E-Commerce",
    technology_digital: "Technology & Digital Services",
  },

  businessStage: {
    idea: "Idea",
    early: "Early",
    growth: "Growth",
  },

  country: {
    Nigeria: "Nigeria",
    Ghana: "Ghana",
    Kenya: "Kenya",
    "South Africa": "South Africa",
  },

  institutionType: {
    commercial_bank: "Commercial Bank",
    development_bank: "Development Bank",
    microfinance_bank: "Microfinance Bank",
    fintech: "Fintech",
    government: "Government",
    ngo: "NGO",
  },
};

export default EKEHI_ENUMS;
