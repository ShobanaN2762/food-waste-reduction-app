import AddRequest from "../features/FindDonations/AddRequest";
import AvailableDonationTable from "../features/FindDonations/AvailableDonationTable";
import DonationRequestTable from "../features/FindDonations/DonationRequestTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Section from "../ui/Section";

function AvailabeDonations() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Find Donations</Heading>
      </Row>
      <Section type="box">
        <Row>
          <Heading as="h2">Check Out the Availabe Donations here!!</Heading>
          <Section>
            <AvailableDonationTable />
          </Section>
        </Row>
      </Section>

      <Section type="box">
        <Row>
          <Heading as="h2">Do you want to Request a Donation?</Heading>
          <Section>
            <DonationRequestTable />
            <Section>
              <AddRequest />
            </Section>
          </Section>
        </Row>
      </Section>
    </>
  );
}
export default AvailabeDonations;
