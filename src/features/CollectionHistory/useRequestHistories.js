import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequests } from "../../services/apiDonationCollection";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { useEffect, useRef } from "react";

export function useRequestHistories() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // FILTER
  const filterValue = searchParams.get("requestStatus");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // SORT
  const sortByRaw = searchParams.get("requestSortBy") || "requested_at-asc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  let page = !searchParams.get("requestPage")
    ? 1
    : Number(searchParams.get("requestPage"));

  const prevFilterValueRef = useRef(filterValue);

  useEffect(() => {
    if (filterValue !== prevFilterValueRef.current) {
      searchParams.set("requestPage", 1);
      setSearchParams(searchParams);
      prevFilterValueRef.current = filterValue; // Update the ref
    }
  }, [filterValue, searchParams, setSearchParams]);

  // QUERY
  const {
    isLoading,
    data: { data: requests, count } = { data: [], count: 0 },
    error,
  } = useQuery({
    queryKey: ["requests", filter, sortBy, page],
    queryFn: () => getRequests({ filter, sortBy, page }),
  });

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["requests", filter, sortBy, page + 1],
      queryFn: () =>
        getRequests({
          filter,
          sortBy,
          page: page + 1,
        }),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["requests", filter, sortBy, page - 1],
      queryFn: () =>
        getRequests({
          filter,
          sortBy,
          page: page - 1,
        }),
    });
  }

  return { isLoading, error, requests, count };
}
