import { PiBowlFood } from "react-icons/pi";
import Stat from "./Stat";
import { LuHeartHandshake } from "react-icons/lu";
import { FaHandsHelping } from "react-icons/fa";
import { BiHappyBeaming } from "react-icons/bi";

function Stats({
  totalRequests,
  totalDonationReceived,
  pendingRequest,
  fullfilledRequests,
}) {
  return (
    <>
      <Stat
        title="Total Requests"
        icon={<LuHeartHandshake />}
        color="blue"
        value={totalRequests}
      />
      <Stat
        title="Total Food Received"
        icon={<PiBowlFood />}
        color="green"
        value={totalDonationReceived}
      />
      <Stat
        title="Pending Request"
        icon={<FaHandsHelping />}
        color="yellow"
        value={pendingRequest}
      />
      <Stat
        title="Fullfilled Requests"
        icon={<BiHappyBeaming />}
        color="indigo"
        value={fullfilledRequests}
      />
    </>
  );
}
export default Stats;
