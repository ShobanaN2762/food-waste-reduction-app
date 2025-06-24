import { useRequestHistories } from "./useRequestHistories";

import RequestHistoryRow from "./RequestHistoryRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function RequestHistoryTable() {
  const { requests, isLoading, count } = useRequestHistories();

  if (isLoading) return <Spinner />;

  if (!requests || requests.length === 0)
    return <Empty resourceName="donations" />;
  return (
    <Menus>
      <Table columns="1.3fr 1.9fr 1.9fr 1fr 1fr 3.2rem">
        <Table.Header>
          <div>ID</div>
          <div>Quantity</div>
          <div>Date</div>
          <div>Status</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={requests}
          render={(request) => (
            <RequestHistoryRow key={request.request_id} request={request} />
          )}
        />
        <Table.Footer>
          <Pagination count={count} pageParam="requestPage" />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default RequestHistoryTable;
