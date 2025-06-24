import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCollections } from "../../services/apiDonationCollection";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { useEffect, useRef } from "react";

export function useNewDonationHistories() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("donationStatus");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT
  const sortByRaw = searchParams.get("donationSortBy") || "created_at-asc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  //PAGINATION
  const page = !searchParams.get("donationPage")
    ? 1
    : Number(searchParams.get("donationPage"));
  // Track the previous filter value using a ref
  const prevFilterValueRef = useRef(filterValue);

  // Reset page to 1 only when the filter changes
  useEffect(() => {
    if (filterValue !== prevFilterValueRef.current) {
      searchParams.set("donationPage", 1);
      setSearchParams(searchParams);
      prevFilterValueRef.current = filterValue; // Update the ref
    }
  }, [filterValue, searchParams, setSearchParams]);

  //QUERY
  const {
    isLoading,
    data: { data: collections, count } = {},
    error,
  } = useQuery({
    queryKey: ["collections", filter, sortBy, page],
    queryFn: () => getCollections({ filter, sortBy, page }),
  });

  //PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["collections", filter, sortBy, page + 1],
      queryFn: () => getCollections({ filter, sortBy, page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["collections", filter, sortBy, page - 1],
      queryFn: () => getCollections({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, error, collections, count };
}
