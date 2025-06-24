import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function NewDonationsTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="donationStatus" // changed
        options={[
          { value: "all", label: "All" },
          { value: "rejected", label: "Rejected" },
          { value: "received", label: "Received" },
        ]}
      />

      <SortBy
        sortField="donationSortBy"
        options={[
          { value: "created_at-asc", label: "Sort by date (earlier first)" },
          { value: "created_at-desc", label: "Sort by date (recent first)" },
        ]}
      />
    </TableOperations>
  );
}

export default NewDonationsTableOperations;
