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

// Fetch donations for the authenticated recipient
export async function getDonations() {
  const userId = await getCurrentUserId();

  // Filter donations for the authenticated recipient user
  const { data, error } = await supabase
    .from("available_donation")
    .select("*")
    .or(`target_recipient_id.is.null,target_recipient_id.eq.${userId}`);
  if (error) {
    console.log(error);
    throw new Error("Donations could not be loaded");
  }

  return data;
}

// Update the donation status for a specific donation of the authenticated user
// apiDonation.js
export async function updateDonationStatus(donation_id, newStatus) {
  const userId = await getCurrentUserId();

  // Step 1: Fetch current status
  const { data: currentData, error: fetchError } = await supabase
    .from("food_donation")
    .select("status, processed")
    .eq("donation_id", donation_id)
    .single();

  if (fetchError) {
    console.error("Error fetching current donation status:", fetchError);
    throw new Error(fetchError.message || "Failed to fetch donation status");
  }

  if (currentData && currentData.status === newStatus) {
    console.log(`Donation ${donation_id} already has status "${newStatus}".`);
    return currentData;
  }

  // OPTIONAL: If you want to block certain updates once status is "received"
  if (currentData.status === "received") {
    throw new Error("Donation is already completed and cannot be updated.");
  }

  // Step 2: Update donation status via RPC
  const { data, error } = await supabase.rpc("update_donation_status", {
    p_donation_id: donation_id,
    p_user_id: userId,
    p_new_status: newStatus,
  });

  if (error) {
    console.error("Update error:", error);
    throw new Error(error.message || "Failed to update donation status");
  }

  // Step 3: Mark as processed ONLY if status is final
  if (newStatus === "received") {
    await supabase
      .from("food_donation")
      .update({ processed: true })
      .eq("donation_id", donation_id);
  }

  return data;
}

export async function markAsReceived(donationId) {
  try {
    const { data, error } = await supabase.rpc("mark_donation_received", {
      p_donation_id: donationId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Failed to mark as received:", {
      donationId,
      error: error.message,
    });
    throw new Error(error.message || "Failed to update donation status");
  }
}
// Fetch request donations for the authenticated user
export async function getRequestDonations() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("recipient_request")
    .select("*")
    .eq("recipient_id", userId); // Updated from user_id to recipient_id

  if (error) {
    console.log(error);
    throw new Error("Donations could not be loaded");
  }

  return data;
}

// Create or edit a donation request for the authenticated user
export async function newEditedRequest(newDonationdata, id) {
  const userId = await getCurrentUserId();

  let query = supabase.from("recipient_request");

  // A) CREATE
  if (!id) {
    query = query.insert([{ ...newDonationdata, recipient_id: userId }]); // Updated from user_id to recipient_id
  }

  // B) EDIT
  if (id) {
    query = query
      .update({ ...newDonationdata })
      .eq("request_id", id)
      .eq("recipient_id", userId) // Ensure the request belongs to the authenticated recipient
      .select();
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error("Request could not be placed");
  }

  return data;
}

// Delete a request donation, ensuring the authenticated user can only delete their own requests
export async function deleteRequest(id) {
  const userId = await getCurrentUserId();

  const { data: request, error: fetchError } = await supabase
    .from("recipient_request")
    .select("status, recipient_id") // Fetch the recipient_id to check ownership
    .eq("request_id", id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Failed to fetch donation request details");
  }

  const { data, error } = await supabase
    .from("recipient_request")
    .update({ status: "deleted", requested_at: new Date().toISOString() })
    .eq("request_id", id)
    .eq("recipient_id", userId); // Ensure the request belongs to the correct recipient

  if (error) {
    console.error(error);
    throw new Error("Donation could not be deleted");
  }

  return data;
}

export async function updateRequest(id) {
  const userId = await getCurrentUserId();

  const { data: request, error: fetchError } = await supabase
    .from("recipient_request")
    .select("status, recipient_id") // Fetch the recipient_id to check ownership
    .eq("request_id", id)
    .single();

  if (fetchError) {
    console.error(fetchError);
    throw new Error("Failed to fetch donation request details");
  }

  const { data, error } = await supabase
    .from("recipient_request")
    .update({ status: "fullfilled" })
    .eq("request_id", id)
    .eq("recipient_id", userId); // Ensure the request belongs to the correct recipient

  if (error) {
    console.error(error);
    throw new Error("Request could not be updated");
  }

  return data;
}

export async function getAllRecipientRequests() {
  const { data, error } = await supabase.from("recipient_request").select("*");
  // .eq("status", "deleted"); // optional filter

  if (error) {
    console.error("Error fetching recipient requests:", error.message);
    return [];
  }

  return data;
}
