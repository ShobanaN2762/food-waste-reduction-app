import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newEditedDonation } from "../../services/apiFoodDonation";
import toast from "react-hot-toast";

export function useNewDonation() {
  const queryClient = useQueryClient();

  const { mutate: newDonation, isLoading: isCreating } = useMutation({
    mutationFn: newEditedDonation,
    onSuccess: () => {
      toast.success("Donation alert placed!");
      queryClient.invalidateQueries({ queryKey: ["donation"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, newDonation };
}
