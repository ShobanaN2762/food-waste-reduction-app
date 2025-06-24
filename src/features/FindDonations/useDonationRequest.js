import { useQuery } from "@tanstack/react-query";
import { getRequestDonations } from "../../services/apiDonation";
export function useDonationRequest() {
  const {
    isLoading,
    data: requests,
    error,
  } = useQuery({
    queryKey: ["donation_request"],
    queryFn: getRequestDonations,
  });

  return { isLoading, error, requests };
}
