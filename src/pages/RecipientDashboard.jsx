import Heading from "../ui/Heading";
import Row from "../ui/Row";
import RecipientDashboardLayout from "../features/RecipientDashboard/RecipientDashboardLayout";
import RecipientDashboardFilter from "../features/RecipientDashboard/RecipientDashboardFilter";

function RecipientDashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <RecipientDashboardFilter />
      </Row>
      <RecipientDashboardLayout />
    </>
  );
}

export default RecipientDashboard;
