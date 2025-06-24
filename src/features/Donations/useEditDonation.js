import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newEditedDonation } from "../../services/apiFoodDonation";
import toast from "react-hot-toast";

export function useEditDonation() {
  const queryClient = useQueryClient();

  const { mutate: editDonation, isLoading: isEditing } = useMutation({
    mutationFn: ({ newDonationdata, id }) =>
      newEditedDonation(newDonationdata, id),
    onSuccess: () => {
      toast.success("Donation successfully edited!");
      queryClient.invalidateQueries({ queryKey: ["donation"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editDonation };
}
