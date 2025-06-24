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

export async function getAvailableDonations({ page, filter, sortBy }) {
  try {
    const userId = await getCurrentUserId();

    console.log(
      `Fetching available donations for recipient ${userId}, page ${page}`
    );

    let query = supabase
      .from("available_donation")
      .select("*", { count: "exact" })
      .or(`recipient_id.is.null,recipient_id.eq.${userId}`); // Important filter

    // Optional filter from searchParams
    if (filter) {
      query = query[filter.method || "eq"](filter.field, filter.value);
    }

    // Optional sorting
    if (sortBy) {
      query = query.order(sortBy.field, {
        ascending: sortBy.direction === "asc",
      });
    }

    // Pagination logic
    if (page) {
      const { from, to } = getPaginationRange(page);
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase query error:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw new Error("Failed to load donation history");
    }

    return {
      data: data || [],
      count: count || 0,
    };
  } catch (error) {
    console.error("Error in getAvailableDonations:", {
      error: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Failed to load donations");
  }
}

export async function getAvailableDonation(donation_id) {
  const userId = await getCurrentUserId();

  console.log("Querying for donation_id:", donation_id);
  console.log("Current user ID:", userId);

  const { data, error } = await supabase
    .from("available_donation")
    .select("*")
    .eq("donation_id", donation_id)
    // Remove donor_id filter for available donations
    // .eq("donor_id", userId)
    .limit(1);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Donation not found");
  }

  console.log("Query result:", data);
  return data?.[0] || null; // Return first item or null
}
