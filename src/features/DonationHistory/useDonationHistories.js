import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDonations } from "../../services/apiMyDonations";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { useEffect, useRef } from "react";

export function useDonationHistories() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "created_at-asc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  //PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  // Track the previous filter value using a ref
  const prevFilterValueRef = useRef(filterValue);

  // Reset page to 1 only when the filter changes
  useEffect(() => {
    if (filterValue !== prevFilterValueRef.current) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
      prevFilterValueRef.current = filterValue; // Update the ref
    }
  }, [filterValue, searchParams, setSearchParams]);

  //QUERY
  const {
    isLoading,
    data: { data: olddonations, count } = {},
    error,
  } = useQuery({
    queryKey: ["olddonations", filter, sortBy, page],
    queryFn: () => getDonations({ filter, sortBy, page }),
  });

  //PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["olddonations", filter, sortBy, page + 1],
      queryFn: () => getDonations({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["olddonations", filter, sortBy, page - 1],
      queryFn: () => getDonations({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, error, olddonations, count };
}
