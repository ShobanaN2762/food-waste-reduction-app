import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteDonation as deleteDonationApi } from "../../services/apiFoodDonation";

export function useDeleteDonation() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteDonation } = useMutation({
    mutationFn: deleteDonationApi,
    onSuccess: () => {
      toast.success("Donation alert successfully deleted!");

      // ✅ Invalidate donor side data
      queryClient.invalidateQueries({ queryKey: ["donation"] });

      // ✅ Invalidate recipient side data
      queryClient.invalidateQueries({ queryKey: ["available_donations"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteDonation };
}
