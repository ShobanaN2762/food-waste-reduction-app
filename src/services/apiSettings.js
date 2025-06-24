import supabase from "./supabase";

// Helper to fetch current user's ID and ensure they are an admin or authorized
async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("User not authenticated");
  return user.id;
}

// Helper to check if the current user has admin privileges
async function isUserAdmin() {
  const userId = await getCurrentUserId();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !profile)
    throw new Error("Profile not found or error fetching profile");

  return profile.role === "admin"; // Assuming admin has role 'admin'
}

export async function getSettings() {
  // Check if the user is an admin (or authorized role)
  const authorized = await isUserAdmin();
  if (!authorized) {
    throw new Error("You are not authorized to view settings");
  }

  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }
  return data;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting(newSetting) {
  // Check if the user is an admin (or authorized role)
  const authorized = await isUserAdmin();
  if (!authorized) {
    throw new Error("You are not authorized to update settings");
  }

  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be updated");
  }
  return data;
}
