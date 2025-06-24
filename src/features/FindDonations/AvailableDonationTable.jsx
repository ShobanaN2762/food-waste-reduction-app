import { useAvailableDonationHistories } from "./useAvailableDonationHistories";
import AvailableDonationRow from "./AvailableDonationRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function AvailableDonationTable() {
  const {
    availables = [],
    isLoading,
    count,
    error,
    isEmpty,
  } = useAvailableDonationHistories();

  if (isLoading) return <Spinner />;

  if (error) {
    return <Empty resourceName="donations" message={error.message} />;
  }

  if (isEmpty) {
    return <Empty resourceName="donations" />;
  }

  return (
    <Menus>
      <Table columns="0.9fr 1.5fr 1.7fr 1.6fr 1fr 3.2rem">
        <Table.Header>
          <div>ID</div>
          <div>Item</div>
          <div>Quantity</div>
          <div>Date</div>
          <div>Status</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={availables}
          render={(available) => (
            <AvailableDonationRow
              key={available.donation_id || available.id}
              available={available}
            />
          )}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default AvailableDonationTable;
