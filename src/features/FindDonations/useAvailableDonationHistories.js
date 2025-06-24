import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvailableDonations } from "../../services/apiAvailableDonation";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { useEffect, useRef, useState } from "react";
import supabase from "../../services/supabase";

export function useAvailableDonationHistories() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userId, setUserId] = useState(null);

  // Get the logged-in user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    };
    fetchUserId();
  }, []);

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

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // Reset to page 1 on filter change
  const prevFilterValueRef = useRef(filterValue);
  useEffect(() => {
    if (filterValue !== prevFilterValueRef.current) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
      prevFilterValueRef.current = filterValue;
    }
  }, [filterValue, searchParams, setSearchParams]);

  // QUERY
  const {
    isLoading,
    data: { data: availables = [], count = 0 } = {},
    error,
  } = useQuery({
    queryKey: ["availables", filter, sortBy, page, userId],
    queryFn: () =>
      getAvailableDonations({
        filter,
        sortBy,
        page,
        userId, // 🔥 pass userId directly to API function
      }),
    keepPreviousData: true,
    select: (data) => ({
      data: data?.data || [],
      count: data?.count || 0,
    }),
    enabled: !!userId, // Only run query when userId is available
  });

  // PREFETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  const prefetch = (targetPage) => {
    if (userId && targetPage >= 1 && targetPage <= pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["availables", filter, sortBy, targetPage, userId],
        queryFn: () =>
          getAvailableDonations({
            filter,
            sortBy,
            page: targetPage,
            userId,
          }),
      });
    }
  };

  prefetch(page + 1);
  prefetch(page - 1);

  return {
    isLoading,
    error,
    availables,
    count,
    isError: !!error,
    isEmpty: !isLoading && (!availables || availables.length === 0),
  };
}
