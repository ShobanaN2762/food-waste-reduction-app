import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: login,
    isLoading,
    error,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (data) => {
      if (!data?.user) {
        throw new Error("User data not received");
      }

      console.log("Login successful - User data:", data);

      // Store user data in query cache
      queryClient.setQueryData(["user"], {
        ...data.user,
        title_role: data.title_role, // optional shortcut
        user_metadata: {
          ...data.user.user_metadata,
          role: data.title_role, // ensures it's present in user_metadata
        },
      });

      // Debugging log
      console.log("Login successful - User data:", data);

      // Redirect based on role with proper error handling
      if (data.title_role === "donor") {
        navigate("/donor-dashboard", { replace: true });
      } else if (data.title_role === "recipient") {
        navigate("/recipient-dashboard", { replace: true });
      } else {
        console.error("Unknown role:", data.title_role);
        toast.error("Your account role is not recognized");
        // Optional: redirect to role selection or contact support page
        navigate("/role-selection");
      }
    },
    onError: (err) => {
      console.error("Login error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response,
      });

      toast.error(
        err.message ||
          "Login failed. Please check your credentials and try again."
      );
    },
    onSettled: () => {
      // Invalidate any existing user queries
      queryClient.invalidateQueries(["user"]);
    },
  });

  return { login, isLoading, error };
}
