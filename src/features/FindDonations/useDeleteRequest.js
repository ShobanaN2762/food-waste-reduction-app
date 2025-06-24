import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteRequest as deleteRequestApi } from "../../services/apiDonation";

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  const { isLoading: isDeleting, mutate: deleteRequest } = useMutation({
    mutationFn: deleteRequestApi,
    onSuccess: () => {
      toast.success("Request alert successfully deleted!");
      queryClient.invalidateQueries({
        queryKey: ["donation_request"],
      });
      queryClient.invalidateQueries({ queryKey: ["available_donations"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteRequest };
}
