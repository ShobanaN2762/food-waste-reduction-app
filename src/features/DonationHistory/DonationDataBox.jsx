import styled from "styled-components";
import { format } from "date-fns";
import { LuHeartHandshake } from "react-icons/lu";

import DataItem from "../../ui/DataItem";
import Section from "../../ui/Section";

const StyledDonationDataBox = styled.section`
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

const Img = styled.img`
  display: inline-block;
  height: 17rem;
  width: 20rem;
  object-fit: cover;
  object-position: center;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  position: relative;
  z-index: 10;
  margin-left: 1rem;

  cursor: pointer;
`;

function formatDate(timestamp) {
  return format(new Date(timestamp), "yyyy-MM-dd"); // Format: YYYY-MM-DD
}

// A purely presentational component
function DonationDataBox({ olddonation }) {
  const {
    donation_id,
    created_at,
    status,
    food_name: item,
    quantity,
    image,
  } = olddonation;
  return (
    <StyledDonationDataBox>
      <Header>
        <div style={{ marginLeft: "3rem" }}>
          <LuHeartHandshake />
          <p>
            ID of the donation is : <span>{donation_id}</span>
          </p>
        </div>
      </Header>

      <Section>
        <DataItem label="Food Item :">{item}</DataItem>
        <DataItem label="food image :">
          <br />
          <Img src={image} />
        </DataItem>

        <Quantity>
          <DataItem label="Total Quantity :">{quantity}</DataItem>
        </Quantity>
      </Section>

      <Footer>
        {status === "deleted"
          ? `Deleted on ${formatDate(new Date())}`
          : status === "delivered"
          ? `Delivered on ${formatDate(new Date(created_at))}`
          : null}
      </Footer>
    </StyledDonationDataBox>
  );
}

export default DonationDataBox;
