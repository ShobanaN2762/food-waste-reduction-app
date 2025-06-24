import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCollection } from "../../services/apiDonationCollection";

export function useNewDonationHistory() {
  const { donation_id } = useParams();
  const {
    isLoading,
    data: collection,
    error,
  } = useQuery({
    queryKey: ["collection"],
    queryFn: () => getCollection(donation_id),
    retry: false,
  });

  return { isLoading, error, collection };
}
