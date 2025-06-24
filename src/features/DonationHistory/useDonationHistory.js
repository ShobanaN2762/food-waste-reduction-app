import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDonation } from "../../services/apiMyDonations";

export function useDonationHistory() {
  const { donation_id } = useParams();
  const {
    isLoading,
    data: olddonation,
    error,
  } = useQuery({
    queryKey: ["olddonation"],
    queryFn: () => getDonation(donation_id),
    retry: false,
    onError: (err) => {
      console.error("Error fetching donation:", err); // Additional error logging
    },
  });

  return { isLoading, error, olddonation };
}
