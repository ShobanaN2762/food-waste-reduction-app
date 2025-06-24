import { PiBowlFood } from "react-icons/pi";
import Stat from "./Stat";
import { LuHeartHandshake } from "react-icons/lu";
import { MdOutlineSportsScore, MdPendingActions } from "react-icons/md";

function Stats({
  totalDonations,
  totalFoodSaved,
  impactScore,
  activeDonations,
}) {
  return (
    <>
      <Stat
        title="Total Donations"
        icon={<LuHeartHandshake />}
        color="blue"
        value={totalDonations}
      />
      <Stat
        title="Total Saved Food"
        icon={<PiBowlFood />}
        color="green"
        value={totalFoodSaved}
      />
      <Stat
        title="Impact Score"
        icon={<MdOutlineSportsScore />}
        color="yellow"
        value={impactScore}
      />
      <Stat
        title="Active Donations"
        icon={<MdPendingActions />}
        color="indigo"
        value={activeDonations}
      />
    </>
  );
}
export default Stats;
