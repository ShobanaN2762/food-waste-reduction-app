import { useQuery } from "@tanstack/react-query";
import supabase from "../../services/supabase";
import { subDays, isValid } from "date-fns";

// Function to get the current user ID
async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("User not authenticated");
  return user.id;
}

// Function to fetch dashboard stats based on userId
async function fetchDashboardStats(userId, numDays = 7) {
  const today = new Date();
  const queryDate = subDays(today, numDays);

  // Validate the date
  if (!isValid(queryDate)) {
    console.error("Error: Invalid date range detected");
    throw new Error("Invalid date range");
  }

  const queryDateISO = queryDate.toISOString(); // Full ISO format including time
  console.log("Querying from date:", queryDateISO); // Debug log

  try {
    // 1. Fetch Total Requests
    const { count: totalRequests, error: totalRequestsError } = await supabase
      .from("request_history")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId) // Filter by recipient_id
      .gte("requested_at", queryDateISO);

    if (totalRequestsError) {
      console.error("Error fetching total requests:", totalRequestsError);
      throw totalRequestsError;
    }

    // 2. Fetch Total Donation Received (sum of quantities)
    const { data: donationsData, error: donationsError } = await supabase
      .from("collection_history")
      .select("quantity")
      .eq("status", "received")
      .eq("recipient_id", userId) // Filter by recipient_id
      .gte("created_at", queryDateISO);

    if (donationsError) {
      console.error("Error fetching donations:", donationsError);
      throw donationsError;
    }

    // Calculate total donation received by summing the quantities
    const totalDonationReceived = donationsData.reduce(
      (sum, donation) => sum + (donation.quantity || 0),
      0
    );

    console.log("Total Donation Received:", totalDonationReceived); // Debug log

    // 3. Fetch Pending Requests
    const { count: pendingRequests, error: pendingError } = await supabase
      .from("recipient_request")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId) // Filter by recipient_id
      .eq("status", "pending")
      .gte("requested_at", queryDateISO);

    if (pendingError) {
      console.error("Error fetching pending requests:", pendingError);
      throw pendingError;
    }

    // 4. Fetch Fulfilled Requests
    const { count: fullfilledRequests, error: fullfilledError } = await supabase
      .from("request_history")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId) // Filter by recipient_id
      .eq("status", "fullfilled")
      .gte("requested_at", queryDateISO);

    if (fullfilledError) {
      console.error("Error fetching fulfilled requests:", fullfilledError);
      throw fullfilledError;
    }

    // 5. Fetch the requests data
    const { data: requestData, error: requestsError } = await supabase
      .from("request_history")
      .select("*")
      .eq("recipient_id", userId) // Filter by recipient_id
      .gte("requested_at", queryDateISO);

    if (requestsError) {
      console.error("Error fetching total requests:", requestsError);
      throw totalRequestsError;
    }

    // 6. Fetch donations that are received
    const { data: donations, error: donationError } = await supabase
      .from("collection_history")
      .select("*")
      .eq("status", "received")
      .eq("recipient_id", userId) // Filter by recipient_id
      .gte("created_at", queryDateISO);

    if (donationError) {
      console.error("Error fetching donations:", donationError);
      throw donationError;
    }

    return {
      totalRequests: totalRequests || 0,
      totalDonationReceived,
      pendingRequests: pendingRequests || 0,
      fullfilledRequests: fullfilledRequests || 0,
      requestData: requestData || [],
      donations: donations || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

// Hook to fetch recipient dashboard stats based on the current user
export function useRecipientDashboardStats(numDays = 30) {
  return useQuery({
    queryKey: ["dashboardStats", numDays],
    queryFn: async () => {
      const userId = await getCurrentUserId(); // Get current user ID
      return fetchDashboardStats(userId, numDays); // Pass userId to fetchDashboardStats
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 2, // Retry up to 2 times on failure
    onError: (error) => {
      console.error("Error in dashboard stats query:", error);
    },
  });
}
