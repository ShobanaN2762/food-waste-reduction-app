import styled from "styled-components";
import { format } from "date-fns";
import Section from "../../ui/Section";
import { HiOutlineHomeModern } from "react-icons/hi2";

import DataItem from "../../ui/DataItem";

const StyledDonationDataBox = styled.section`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Quantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem 3.2rem;
  border-radius: var(--border-radius-sm);
  margin-top: 2.4rem;

  background-color: ${(props) =>
    props.isPaid ? "var(--color-green-100)" : "var(--color-yellow-100)"};
  color: ${(props) =>
    props.isPaid ? "var(--color-green-700)" : "var(--color-yellow-700)"};
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

function formatDate(timestamp) {
  return format(new Date(timestamp), "yyyy-MM-dd"); // Format: YYYY-MM-DD
}

// A purely presentational component
function RequestHistoryDataBox({ request }) {
  const {
    request_id,
    requested_at,
    status,
    urgency_level,
    quantity_needed,
    message,
  } = request;
  return (
    <StyledDonationDataBox>
      <Header>
        <div style={{ marginLeft: "3rem" }}>
          <HiOutlineHomeModern />
          <p>
            ID of the request is : <span>{request_id}</span>
          </p>
        </div>
      </Header>

      <Section>
        <DataItem label="Urgency Level:">{urgency_level}</DataItem>

        <DataItem label="Message:">{message}</DataItem>

        <Quantity>
          <DataItem label="Requested Quantity :">{quantity_needed}</DataItem>
        </Quantity>
      </Section>

      <Footer>
        <p>
          {status === "deleted"
            ? `Deleted on ${formatDate(new Date())}`
            : status === "fullfilled"
            ? `Fullfilled on ${formatDate(new Date(requested_at))}`
            : null}
        </p>
      </Footer>
    </StyledDonationDataBox>
  );
}

export default RequestHistoryDataBox;
