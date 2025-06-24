import styled from "styled-components";
import { format } from "date-fns";
import { HiOutlineHomeModern } from "react-icons/hi2";
import Section from "../../ui/Section";

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
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1rem 0;
`;

const Img = styled.img`
  height: 180px;
  width: 240px;
  object-fit: cover;
  object-position: center;
  border: 1px solid #ccc;
`;

function formatDate(timestamp) {
  return format(new Date(timestamp), "yyyy-MM-dd"); // Format: YYYY-MM-DD
}

// A purely presentational component
function AvailableDonationDataBox({ available }) {
  const {
    donation_id,
    created_at,
    food_name: item,
    quantity,
    category,
    image,
    status,
    donor_address,
  } = available;
  return (
    <StyledDonationDataBox>
      <Header>
        <div style={{ marginLeft: "3rem" }}>
          <HiOutlineHomeModern />
          <p>
            ID of the donation is : <span>{donation_id}</span>
          </p>
        </div>
      </Header>

      <Section>
        <DataItem label="Food Item :">{item}</DataItem>

        <DataItem label="Food Category: ">{category}</DataItem>
        <DataItem label="food image :">
          <ImgContainer>
            <Img src={image} />
          </ImgContainer>
        </DataItem>

        <DataItem label="Donor Address:">{donor_address}</DataItem>

        <Quantity>
          <DataItem label="Total Quantity :">{quantity}</DataItem>
        </Quantity>
      </Section>

      <Footer>
        <p>
          {status === "accepted"
            ? `Accepted on ${formatDate(new Date(created_at))}`
            : status === "pending"
            ? `Pending...`
            : null}
        </p>
      </Footer>
    </StyledDonationDataBox>
  );
}

export default AvailableDonationDataBox;
