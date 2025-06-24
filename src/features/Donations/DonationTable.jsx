import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import DonationRow from "./DonationRow";
import { useDonation } from "./useDonation";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

function DonationTable() {
  const { isLoading, donations } = useDonation();

  if (isLoading) return <Spinner />;
  if (!donations || donations.length === 0)
    return <Empty resourceName="donation" />;

  return (
    <Menus>
      <Table columns="5fr 5fr 5fr 5fr 3fr 2.7fr">
        <Table.Header>
          <div>ID</div>
          <div>Item</div>
          <div>Category</div>
          <div>Quantity</div>
          <div>Status</div>
        </Table.Header>
        <Table.Body
          data={donations}
          render={(donation) => (
            <DonationRow donation={donation} key={donation.donation_id} />
          )}
        />
      </Table>
    </Menus>
  );
}
export default DonationTable;
