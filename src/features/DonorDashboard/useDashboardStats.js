import { subDays, isValid, format } from "date-fns";
import supabase from "../../services/supabase";
import { useQuery } from "@tanstack/react-query";

// Function to get the current user ID
async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("User not authenticated");
  return user.id;
}

async function fetchDashboardStats(userId, numDays = 7) {
  const today = new Date();
  const queryDate = subDays(today, numDays);

  if (!isValid(queryDate)) {
    throw new Error("Invalid date range");
  }

  const queryDateISO = queryDate.toISOString();

  // 1. Total Donations
  const { count: totalDonations, error: totalError } = await supabase
    .from("mydonation")
    .select("*", { count: "exact", head: true })
    .eq("donor_id", userId)
    .gte("created_at", queryDateISO);

  if (totalError) throw totalError;

  // 2. Total Food Saved (Delivered only)
  const { data: totalFoodData, error: foodError } = await supabase
    .from("mydonation")
    .select("quantity")
    .eq("status", "delivered")
    .eq("donor_id", userId)
    .gte("created_at", queryDateISO);

  if (foodError) throw foodError;

  const totalFoodSaved = totalFoodData.reduce(
    (sum, donation) => sum + (donation.quantity || 0),
    0
  );

  // 3. Active Donations
  const { count: activeDonations, error: activeError } = await supabase
    .from("food_donation")
    .select("*", { count: "exact", head: true })
    .eq("donor_id", userId)
    .in("status", ["pending", "accepted", "pickup confirmed"])
    .gte("created_at", queryDateISO);

  if (activeError) throw activeError;

  const impactScore = totalFoodSaved * 10;

  // 4. Daily donation records for trends
  const { data: dailyDonations, error: dailyError } = await supabase
    .from("mydonation")
    .select("created_at")
    .eq("donor_id", userId)
    .gte("created_at", queryDateISO);

  if (dailyError) throw dailyError;

  // Group by date (e.g. "Apr 18")
  const dailyTotalsMap = {};

  dailyDonations.forEach((entry) => {
    const dateKey = format(new Date(entry.created_at), "MMM dd");
    dailyTotalsMap[dateKey] = (dailyTotalsMap[dateKey] || 0) + 1;
  });

  return {
    totalDonations,
    totalFoodSaved,
    impactScore,
    activeDonations,
    dailyTotalsMap, // 👈 used in the chart
  };
}

export function useDashboardStats(numDays = 7) {
  return useQuery({
    queryKey: ["dashboardStats", numDays],
    queryFn: async () => {
      const userId = await getCurrentUserId(); // Get current user ID
      return fetchDashboardStats(userId, numDays); // Pass userId to fetchDashboardStats
    },
    staleTime: 60000, // Cache for 60 seconds
  });
}
