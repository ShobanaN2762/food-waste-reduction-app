import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import { subDays, format } from "date-fns";
import { useDashboardStats } from "./useDashboardStats";
import { useDarkMode } from "../../context/DarkModeContext";
import Heading from "../../ui/Heading";

import {
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const StyledDonationChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function DonationTrendsChart({ numDays }) {
  const { isDarkMode } = useDarkMode();
  const { data, isLoading, error } = useDashboardStats(numDays);

  if (isLoading) return <p>Loading donation trends...</p>;
  if (error) return <p>Error fetching donation data!</p>;

  const today = new Date();
  const dateRange = Array.from({ length: numDays }, (_, i) =>
    format(subDays(today, numDays - 1 - i), "MMM dd")
  );

  const dailyTotalsMap = data?.dailyTotalsMap || {};

  const donationData = dateRange.map((date) => ({
    date,
    totalDonations: dailyTotalsMap[date] || 0,
  }));

  const colors = isDarkMode
    ? {
        totalDonations: { stroke: "#4f46e5", fill: "#4f46e5" },
        text: "#e5e7eb",
        background: "#18212f",
      }
    : {
        totalDonations: { stroke: "#4f46e5", fill: "#c7d2fe" },
        text: "#374151",
        background: "#fff",
      };

  return (
    <StyledDonationChart>
      <Heading as="h2" style={{ display: "flex", justifyContent: "center" }}>
        Donation Trends (Last {numDays} Days)
      </Heading>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={donationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={colors.text} />
          <YAxis
            stroke={colors.text}
            label={{
              value: "Food Donated (kg)",
              angle: -90,
              position: "insideLeft",
              dy: 20,
              dx: 1,
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip contentStyle={{ backgroundColor: colors.background }} />
          <Area
            type="monotone"
            dataKey="totalDonations"
            stroke={colors.totalDonations.stroke}
            fill={colors.totalDonations.fill}
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </StyledDonationChart>
  );
}

export default DonationTrendsChart;
