import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newEditedRequest } from "../../services/apiDonation";
import toast from "react-hot-toast";

export function useNewRequestDonation() {
  const queryClient = useQueryClient();

  const { mutate: newRequest, isLoading: isCreating } = useMutation({
    mutationFn: newEditedRequest,
    onSuccess: () => {
      toast.success("Donation alert placed!");
      queryClient.invalidateQueries({ queryKey: ["donation_request"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, newRequest };
}
