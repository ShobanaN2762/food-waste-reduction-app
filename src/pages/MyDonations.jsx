import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DonationHistoryTable from "../features/DonationHistory/DonationHistoryTable";
import DonationsTableOpeartions from "../features/DonationHistory/DonationsTableOperations";

function MyDonations() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Donations History</Heading>
        <DonationsTableOpeartions />
      </Row>
      <DonationHistoryTable />
    </>
  );
}

export default MyDonations;
