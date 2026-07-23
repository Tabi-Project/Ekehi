import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createOpportunitySchema,
  listOpportunitiesQuery,
} from "../src/modules/opportunities/opportunities.schema";

test("listOpportunitiesQuery parses valid search and pagination query params", () => {
  const result = listOpportunitiesQuery.safeParse({
    search: "grant",
    opportunity_type: "grant_ngo",
    page: "1",
    limit: "10",
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.search, "grant");
    assert.equal(result.data.opportunity_type, "grant_ngo");
    assert.equal(result.data.page, 1);
    assert.equal(result.data.limit, 10);
  }
});

test("createOpportunitySchema accepts valid opportunity input", () => {
  const input = {
    opportunity_title: "Tech Innovation Grant",
    funder_name: "Africa Tech Foundation",
    opportunity_type: "grant_ngo",
    amount_min: 1000,
    amount_max: 5000,
    currency: "USD",
    is_women_only: true,
  };

  const result = createOpportunitySchema.safeParse(input);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.opportunity_title, "Tech Innovation Grant");
    assert.equal(result.data.is_women_only, true);
  }
});

test("createOpportunitySchema fails when required fields are missing or empty", () => {
  const input = {
    opportunity_title: "",
    funder_name: "Africa Tech Foundation",
    opportunity_type: "invalid_type",
  };

  const result = createOpportunitySchema.safeParse(input);
  assert.equal(result.success, false);
});
