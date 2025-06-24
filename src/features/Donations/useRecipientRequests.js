import { useQuery } from "@tanstack/react-query";
import { getAllRecipientRequests } from "../../services/apiDonation";

export function useRecipientRequests() {
  return useQuery({
    queryKey: ["recipient_requests"],
    queryFn: getAllRecipientRequests,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
