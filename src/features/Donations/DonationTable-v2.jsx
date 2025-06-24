import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import DonationRow from "./DonationRow";
import { useDonation } from "./useDonation";

const Table = styled.div`
  border: 1px solid var(--color-grey-200);

  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: 7px;
  overflow: hidden;
`;

const TableHeader = styled.header`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 25fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;

  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  padding: 1.6rem 2.4rem;
`;

function DonationTable() {
  const { isLoading, donations } = useDonation();

  if (isLoading) return <Spinner />;

  return (
    <Table role="table">
      <TableHeader role="row">
        <div>ID</div>
        <div>Item</div>
        <div>Quantity</div>
        <div>Status</div>
      </TableHeader>
      {donations.map((donation) => (
        <DonationRow donation={donation} key={donation.donation_id} />
      ))}
    </Table>
  );
}
export default DonationTable;
