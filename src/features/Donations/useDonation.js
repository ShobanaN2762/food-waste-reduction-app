import { useQuery } from "@tanstack/react-query";
import { getFoodDonation } from "../../services/apiFoodDonation";
export function useDonation() {
  const {
    isLoading,
    data: donations,
    error,
  } = useQuery({
    queryKey: ["donation"],
    queryFn: getFoodDonation,
  });

  return { isLoading, error, donations };
}
