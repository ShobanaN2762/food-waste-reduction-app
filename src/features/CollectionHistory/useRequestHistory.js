import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRequest } from "../../services/apiDonationCollection";

export function useRequestHistory() {
  const { request_id } = useParams();
  const {
    isLoading,
    data: request,
    error,
  } = useQuery({
    queryKey: ["request"],
    queryFn: () => getRequest(request_id),
    retry: false,
  });

  return { isLoading, error, request };
}
