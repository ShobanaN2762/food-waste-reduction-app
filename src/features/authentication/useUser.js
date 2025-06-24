// useUser.js
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  console.log("👤 Cached user data in useUser:", user);
  console.log(
    "✅ Extracted role from user_metadata:",
    user?.user_metadata?.role
  );

  return {
    isLoading,
    user,
    isAuthenticated: !!user,
    role: user?.user_metadata?.role, // ✅ fixed this line
  };
}
