import supabase, { supabaseUrl } from "./supabase";

// Helper to fetch current user's ID
async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("User not authenticated");
  return user.id;
}

export async function getFoodDonation() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("food_donation")
    .select("*")
    .eq("donor_id", userId); // Updated from user_id to donor_id

  if (error) {
    console.log("Error fetching food donations:", error.message);
    throw new Error("Failed to fetch food donations");
  }

  return data;
}

export async function newEditedDonation(newDonationdata, id) {
  const userId = await getCurrentUserId();

  const hasImagePath = newDonationdata.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newDonationdata.image.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newDonationdata.image
    : `${supabaseUrl}/storage/v1/object/public/food_image/${imageName}`;

  // 1. Create/Edit new donation
  let query = supabase.from("food_donation");

  // A) CREATE
  if (!id) {
    query = query.insert([
      {
        ...newDonationdata,
        image: imagePath,
        donor_id: userId, // 🔑 Assign user_id during creation
      },
    ]);
  }

  // B) EDIT
  if (id) {
    query = query
      .update({ ...newDonationdata, image: imagePath })
      .eq("donation_id", id)
      .eq("donor_id", userId) // Ensure editing only the authenticated user's donation
      .select();
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.log(error);
    throw new Error("Donations could not be placed");
  }

  // 2. Upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("food_image")
    .upload(imageName, newDonationdata.image);

  // 3. Delete the donation if there was an error in uploading image
  if (storageError) {
    await supabase
      .from("food_donation")
      .delete()
      .eq("donation_id", data.donation_id)
      .eq("user_id", userId); // Ensure the correct user's donation is deleted
    console.log(storageError);
    throw new Error("Image could not be uploaded");
  }

  return data;
}

export async function deleteDonation(id) {
  const userId = await getCurrentUserId();

  // Fetch the donation to verify it belongs to the user and to check its current status
  const { data: donation, error: fetchError } = await supabase
    .from("food_donation")
    .select("status, donation_id, donor_id")
    .eq("donation_id", id)
    .eq("donor_id", userId) // Ensure the donation belongs to the current user
    .single();

  if (fetchError) {
    console.error("Fetch error:", fetchError);
    throw new Error("Failed to fetch donation details");
  }

  // Check if the status is already "pickup confirmed"
  if (donation.status === "pickup confirmed") {
    throw new Error(
      "Cannot delete donation: Pickup has already been confirmed"
    );
  }

  // Update the status to "deleted" to trigger the function and move the record
  const { data, error } = await supabase
    .from("food_donation")
    .update({ status: "deleted", created_at: new Date().toISOString() })
    .eq("donation_id", id)
    .eq("donor_id", userId); // Ensure the donation belongs to the correct user

  if (error) {
    console.error("Update error:", error);
    throw new Error("Donation status could not be updated to deleted");
  }

  return data;
}

export async function updateDonationStatusApi(id, status) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("food_donation")
    .update({ status })
    .eq("donation_id", id)
    .eq("donor_id", userId); // Ensure only the user's donation is updated

  if (error) throw new Error(error.message);
  return data;
}
