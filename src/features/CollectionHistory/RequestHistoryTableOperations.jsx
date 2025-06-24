import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function RequestTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="requestStatus" // changed
        options={[
          { value: "all", label: "All" },
          { value: "deleted", label: "Deleted" },
          { value: "fullfilled", label: "Fullfilled" },
        ]}
      />

      <SortBy
        sortField="requestSortBy"
        options={[
          { value: "requested_at-asc", label: "Sort by date (recent first)" },
          { value: "requested_at-desc", label: "Sort by date (earlier first)" },
        ]}
      />
    </TableOperations>
  );
}

export default RequestTableOperations;
