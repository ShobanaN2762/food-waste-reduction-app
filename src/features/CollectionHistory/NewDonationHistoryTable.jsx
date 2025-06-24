import { useNewDonationHistories } from "./useNewDonationHistories";

import NewDonationHistoryRow from "./NewDonationHistoryRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function NewDonationHistoryTable() {
  const { collections, isLoading, count } = useNewDonationHistories();

  if (isLoading) return <Spinner />;

  if (!collections || collections.length === 0)
    return <Empty resourceName="donations" />;
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
          data={collections}
          render={(collection) => (
            <NewDonationHistoryRow
              key={collection.id}
              collection={collection}
            />
          )}
        />
        <Table.Footer>
          <Pagination count={count} pageParam="donationPage" />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default NewDonationHistoryTable;
