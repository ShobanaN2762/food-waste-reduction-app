import styled from "styled-components";
import Heading from "../../ui/Heading";
import RecipientDashboardBox from "./RecipientDashboardBox";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDarkMode } from "../../context/DarkModeContext";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";

const StyledRecipientChart = styled(RecipientDashboardBox)`
  grid-column: 1 / -1;

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function RecipientTrendChart({ requests, donations, numDays }) {
  const { isDarkMode } = useDarkMode();

  const daysToShow = numDays > 0 ? numDays : 30;

  const allDates = eachDayOfInterval({
    start: subDays(new Date(), daysToShow - 1),
    end: new Date(),
  });

  // Aggregate data for each day
  const data = allDates.map((date) => {
    // Initialize counts for requests and donations
    let totalRequests = 0;
    let totalDonationReceived = 0;

    // If requests is an object, iterate over its keys (request IDs)
    if (requests && typeof requests === "object") {
      for (const requestId in requests) {
        if (requests.hasOwnProperty(requestId)) {
          const request = requests[requestId];
          if (isSameDay(date, new Date(request.requested_at))) {
            totalRequests += 1; // Increment for each matching request
          }
        }
      }
    }

    // If donations is an array, filter and count matching donations
    if (Array.isArray(donations)) {
      totalDonationReceived = donations.filter((donation) =>
        isSameDay(date, new Date(donation.created_at))
      ).length;
    }

    return {
      label: format(date, "MMM dd"),
      totalRequests,
      totalDonationReceived,
    };
  });

  const colors = isDarkMode
    ? {
        totalRequests: { stroke: "#4f46e5", fill: "#4f46e5" },
        totalDonationReceived: { stroke: "#10b981", fill: "#10b981" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalRequests: { stroke: "#4f46e5", fill: "#c7d2fe" },
        totalDonationReceived: { stroke: "#10b981", fill: "#a7f3d0" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledRecipientChart>
      <Heading as="h2">
        Recipient Request & Donation Trends (Last {daysToShow} Days)
      </Heading>

      <ResponsiveContainer height={300} width="100%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <YAxis
            unit="requests / kg"
            tick={{ fill: colors.text }}
            tickLine={{ stroke: colors.text }}
          />
          <CartesianGrid strokeDasharray="4" />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            dataKey="totalRequests"
            type="monotone"
            stroke={colors.totalRequests.stroke}
            fill={colors.totalRequests.fill}
            strokeWidth={3} // Increased stroke width
            strokeDasharray="none" // Ensure solid line
            name="Total Requests"
            unit="requests"
            strokeLinejoin="round" // Ensures smooth line joins
          />
          <Area
            dataKey="totalDonationReceived"
            type="monotone"
            stroke={colors.totalDonationReceived.stroke}
            fill={colors.totalDonationReceived.fill}
            strokeWidth={3} // Increased stroke width
            strokeDasharray="none" // Ensure solid line
            name="Total Donations Received"
            unit="donation"
            strokeLinejoin="round" // Ensures smooth line joins
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledRecipientChart>
  );
}

export default RecipientTrendChart;
