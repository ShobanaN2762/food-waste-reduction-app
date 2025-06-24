import { useDonationHistories } from "./useDonationHistories";

import DonationHistoryRow from "./DonationHistoryRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function DonationHistoryTable() {
  const { olddonations, isLoading, count } = useDonationHistories();

  if (isLoading) return <Spinner />;

  if (!olddonations.length) return <Empty resourceName="donations" />;
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
          data={olddonations}
          render={(olddonation) => (
            <DonationHistoryRow
              key={olddonation.id}
              olddonation={olddonation}
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

export default DonationHistoryTable;
