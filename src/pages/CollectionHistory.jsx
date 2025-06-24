import Heading from "../ui/Heading";
import Row from "../ui/Row";
import Section from "../ui/Section";
import NewDonationHistoryTable from "../features/CollectionHistory/NewDonationHistoryTable";
import NewDonationsTableOpeartions from "../features/CollectionHistory/NewDonationsTableOperations";
import RequestHistoryTable from "../features/CollectionHistory/RequestHistoryTable";
import RequestHistoryTableOperations from "../features/CollectionHistory/RequestHistoryTableOperations";

function CollectionHistory() {
  return (
    <>
      <Row>
        <Heading as="h1">History</Heading>
      </Row>
      <Section type="box">
        <Row type="horizontal">
          <Heading as="h2">Collection History</Heading>
          <NewDonationsTableOpeartions />
        </Row>
        <Section>
          <NewDonationHistoryTable />
        </Section>
      </Section>

      <Section type="box">
        <Row type="horizontal">
          <Heading as="h2">Request History</Heading>
          <RequestHistoryTableOperations />
        </Row>
        <Section>
          <RequestHistoryTable />
        </Section>
      </Section>
    </>
  );
}

export default CollectionHistory;
