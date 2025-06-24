import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import { useDashboardStats } from "./useDashboardStats";
import DonationTrendsChart from "./DonationTrendChart";
import Stats from "./Stats";

import Spinner from "../../ui/Spinner";
const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const [searchParams] = useSearchParams();
  let numDays = searchParams.get("last") ? Number(searchParams.get("last")) : 7;

  // Ensure numDays is a valid positive number
  if (isNaN(numDays) || numDays <= 0) {
    numDays = 7;
  }

  const { data: stats, isLoading: statsLoading } = useDashboardStats(numDays);

  if (statsLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        totalDonations={stats?.totalDonations || 0}
        totalFoodSaved={stats?.totalFoodSaved || 0}
        impactScore={stats?.impactScore || 0}
        activeDonations={stats?.activeDonations || 0}
      />
      <DonationTrendsChart numDays={numDays} />
    </StyledDashboardLayout>
  );
}
export default DashboardLayout;
