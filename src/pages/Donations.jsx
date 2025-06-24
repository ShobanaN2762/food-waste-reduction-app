import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DonationTable from "../features/Donations/DonationTable";
import AddDonation from "../features/Donations/AddDonation";

function Donation() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Donations</Heading>
        {/* <p>Filter / Sort</p> */}
      </Row>

      <Row>
        <AddDonation />
        <DonationTable />
      </Row>
    </>
  );
}

export default Donation;
