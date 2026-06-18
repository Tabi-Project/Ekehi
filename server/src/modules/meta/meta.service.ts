import { supabase } from "#/lib/supabase";
import {
  COST_TYPES,
  DURATION_RANGES,
  INSTITUTION_TYPES,
  LISTING_STATUSES,
  LOCATION_SCOPES,
  OPPORTUNITY_TYPES,
  PROGRAMME_TYPES,
  TRAINING_FORMATS,
} from "#/models/enums";

export async function getMeta() {
  const [sectorsResult, stagesResult] = await Promise.all([
    supabase.from("sectors").select("slug, display_name").order("slug"),
    supabase.from("stages").select("slug, display_name").order("slug"),
  ]);

  if (sectorsResult.error) throw sectorsResult.error;
  if (stagesResult.error) throw stagesResult.error;

  return {
    opportunity_types: OPPORTUNITY_TYPES,
    listing_statuses: LISTING_STATUSES,
    training_formats: TRAINING_FORMATS,
    programme_types: PROGRAMME_TYPES,
    cost_types: COST_TYPES,
    duration_ranges: DURATION_RANGES,
    location_scopes: LOCATION_SCOPES,
    institution_types: INSTITUTION_TYPES,
    sectors: sectorsResult.data,
    stages: stagesResult.data,
  };
}
