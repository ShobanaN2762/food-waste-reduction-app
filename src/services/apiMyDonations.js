import { getPaginationRange } from "../utils/helpers";
import supabase from "./supabase";

// Helper to fetch current user's ID
async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("User not authenticated");
  return user.id;
}

export async function getDonations({ filter, sortBy, page }) {
  const userId = await getCurrentUserId();

  let query = supabase.from("mydonation").select("*", { count: "exact" });

  // FILTER
  if (filter) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }

  // SORT
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "desc",
    });
  }

  // PAGINATION
  if (page) {
    const { from, to } = getPaginationRange(page);
    query = query.range(from, to);
  }
  // Scope query by donor_id to ensure data isolation
  query = query.eq("donor_id", userId);

  const { data, error, count } = await query;
  if (error) {
    throw new Error("Donations history could not be loaded");
  }

  return { data, count };
}

export async function getDonation(donation_id) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("mydonation")
    .select("*")
    .eq("donation_id", donation_id)
    .eq("donor_id", userId) // Ensure data belongs to the current user
    .single();
  if (error) {
    console.error(error);
    throw new Error("Donation not found or not authorized");
  }

  return data;
}

// Returns all Donations that were created after the given date. Useful to get donations created in the last 30 days, for example.
// date:ISOString
export async function getMyDonationsAfterDate(date) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("mydonation")
    .select("created_at, donation_id, quantity")
    .gte("created_at", date)
    .lte("created_at", new Date().toISOString()) // Ensure the end date is in ISO format
    .eq("donor_id", userId); // Scope by donor_id

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("Donations could not be loaded");
  }

  return data;
}
