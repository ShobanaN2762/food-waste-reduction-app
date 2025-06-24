import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateRequest as updateRequestApi } from "../../services/apiDonation";

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateRequest } = useMutation({
    mutationFn: updateRequestApi,
    onSuccess: () => {
      toast.success("Request alert successfully upadated!");
      queryClient.invalidateQueries({
        queryKey: ["donation_request"],
      });
      queryClient.invalidateQueries({ queryKey: ["available_donations"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isUpdating, updateRequest };
}
