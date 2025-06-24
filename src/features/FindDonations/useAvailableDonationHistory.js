// useAvailableDonationHistory.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getAvailableDonation } from "../../services/apiAvailableDonation";

export default function useAvailableDonationHistory() {
  const { donation_id } = useParams();
  const queryClient = useQueryClient();

  const {
    isLoading,
    data: available,
    error,
  } = useQuery({
    queryKey: ["available", donation_id],
    queryFn: () => getAvailableDonation(donation_id),
    retry: false,
  });

  // Add function to manually refetch
  const refetch = () => {
    queryClient.invalidateQueries(["available", donation_id]);
  };

  return {
    isLoading,
    error,
    available,
    refetch, // Expose refetch function
  };
}
