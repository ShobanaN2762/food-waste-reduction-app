import styled from "styled-components";
import Stats from "./Stats";
import { useSearchParams } from "react-router-dom";
import { useRecipientDashboardStats } from "./useRecipientDashboardStats";
import Spinner from "../../ui/Spinner";
import RecipientTrendsChart from "./RecipientTrendChart";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.4rem;
  grid-template-rows: auto;
`;

function RecipientDashboardLayout() {
  // Retrieve the 'last' query parameter for the number of days, defaulting to 7
  const [searchParams] = useSearchParams();
  let numDays = searchParams.get("last");

  // Ensure numDays is a valid positive number, default to 7 if invalid
  numDays =
    isNaN(Number(numDays)) || Number(numDays) <= 0 ? 7 : Number(numDays);

  // Fetch the dashboard stats based on the number of days
  const {
    data,
    isLoading: statsLoading,
    isError: statsError,
  } = useRecipientDashboardStats(numDays);

  // If data is loading, show a spinner
  if (statsLoading) {
    return <Spinner />;
  }

  // Handle errors if the stats query or requests query fails
  if (statsError) {
    return <div>Error loading dashboard stats. Please try again later.</div>;
  }

  // If stats are available, render the dashboard layout with the Stats component
  return (
    <StyledDashboardLayout>
      <Stats
        totalDonationReceived={data?.totalDonationReceived || 0}
        totalRequests={data?.totalRequests || 0}
        pendingRequest={data?.pendingRequests || 0}
        fullfilledRequests={data?.fullfilledRequests || 0}
      />
      <RecipientTrendsChart
        requests={data.requestData}
        donations={data.donations}
        numDays={numDays}
      />
    </StyledDashboardLayout>
  );
}

export default RecipientDashboardLayout;
