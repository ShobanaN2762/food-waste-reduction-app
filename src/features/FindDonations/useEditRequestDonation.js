import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newEditedRequest } from "../../services/apiDonation";
import toast from "react-hot-toast";

export function useEditRequestDonation() {
  const queryClient = useQueryClient();

  const { mutate: editRequest, isLoading: isEditing } = useMutation({
    mutationFn: ({ newDonationdata, id }) =>
      newEditedRequest(newDonationdata, id),
    onSuccess: () => {
      toast.success("Donation successfully edited!");
      queryClient.invalidateQueries({ queryKey: ["donation_request"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editRequest };
}
