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

// Collection History APIs
export async function getCollections({ filter, sortBy, page }) {
  const userId = await getCurrentUserId();

  let query = supabase
    .from("collection_history")
    .select("*", { count: "exact" })
    .eq("recipient_id", userId);

  // FILTER
  if (filter) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }

  // SORT
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });
  }

  // PAGINATION
  if (page) {
    const { from, to } = getPaginationRange(page);
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error("Donations history could not be loaded");
  }

  return { data, count };
}

export async function getCollection(donation_id) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("collection_history")
    .select("*")
    .eq("donation_id", donation_id)
    .eq("recipient_id", userId) // Ensure data belongs to the current user
    .single();

  if (error) {
    console.error(error);
    throw new Error("Donation not found");
  }

  return data;
}

// Returns all Donations that are created after the given date. Useful to get donations created in the last 30 days, for example.
// date: ISOString
export async function getCollectionsAfterDate(date) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("collection_history")
    .select("created_at, donation_id, quantity")
    .gte("created_at", date)
    .lte("created_at", new Date().toISOString()) // Ensure the end date is in ISO format
    .eq("donor_id", userId); // Updated from user_id to donor_id

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("Donations could not get loaded");
  }

  return data;
}

// Request APIs

export async function getRequests({ filter, sortBy, page }) {
  const userId = await getCurrentUserId();

  let query = supabase
    .from("request_history")
    .select("*", { count: "exact" })
    .eq("recipient_id", userId);

  // FILTER
  if (filter) {
    query = query[filter.method || "eq"](filter.field, filter.value);
  }

  // SORT
  if (sortBy) {
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc", // Fixed this logic
    });
  }

  // PAGINATION
  if (page) {
    const { from, to } = getPaginationRange(page);
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase Error:", error);
    throw new Error("Requests history could not be loaded");
  }

  return { data, count };
}

export async function getRequest(request_id) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("request_history")
    .select("*")
    .eq("request_id", request_id)
    .eq("recipient_id", userId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Request not found");
  }

  return data;
}
