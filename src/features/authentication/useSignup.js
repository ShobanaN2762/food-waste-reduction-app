import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { toast } from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success(
        "Account created successfully! Check your email for verification."
      );
    },
    onError: (error) => {
      console.error("Signup error:", error);
      toast.error(error.message);
    },
  });

  return { signup, isLoading };
}
