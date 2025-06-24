import supabase, { supabaseUrl } from "./supabase";

export async function signup({
  full_name,
  email,
  password,
  titlerole,
  address,
  phoneNumber,
}) {
  try {
    // 1. Create user in auth system
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role: titlerole, // Ensure role is passed in the metadata
          address,
          phone_number: phoneNumber,
        },
      },
    });

    if (authError) {
      console.error(authError);
      throw new Error(authError.message || "Authentication failed");
    }

    const user = authData.user;
    if (!user) {
      throw new Error("User not returned after signup");
    }

    // 2. Wait for trigger (with retry logic)
    let retries = 3;
    let profileError = null;

    while (retries > 0) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            title_role: titlerole,
            address: address,
            phone_number: phoneNumber,
          })
          .eq("id", user.id);

        if (!error) {
          console.log("Profile updated successfully");
          return authData;
        }
        profileError = error;
      } catch (err) {
        profileError = err;
      }

      retries--;
      if (retries > 0) {
        console.log(`Retrying profile update (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    throw (
      profileError ||
      new Error("Failed to update profile after multiple attempts")
    );
  } catch (error) {
    console.error("Complete signup error:", {
      message: error.message,
      stack: error.stack,
      details: error.details,
    });
    throw new Error(error.message || "Signup process failed");
  }
}

export async function login({ email, password }) {
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError) throw new Error(authError.message);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (profileError) throw new Error("Failed to load user profile");
  if (!profile) throw new Error("User profile not found");

  const titleRole = profile.title_role || "user";

  // ✅ Store role in localStorage
  localStorage.setItem("userRole", titleRole);

  return {
    user: authData.user,
    title_role: titleRole,
  };
}

export async function getCurrentUser() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw new Error(authError.message);
  if (!user) return null;

  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("title_role")
    .eq("id", user.id);

  if (profileError) {
    console.error("Profile fetch error:", profileError.message);
    throw new Error(profileError.message);
  }

  if (!profiles || profiles.length === 0) {
    console.error("No profile found for user");
    return null;
  }

  if (profiles.length > 1) {
    console.warn("Multiple profiles found for user. Using the first one.");
  }

  return {
    ...user,
    title_role: profiles[0].title_role,
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Update password OR fullNAme
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar=${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar in the user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars//${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);
  return updatedUser;
}
