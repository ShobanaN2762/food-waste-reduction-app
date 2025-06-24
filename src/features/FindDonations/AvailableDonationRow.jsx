import { format } from "date-fns";
import styled from "styled-components";
import { HiEye } from "react-icons/hi2";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

import { useNavigate } from "react-router-dom";

const Numericals = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-weight: 500;

  // & span:first-child {
  //   font-weight: 500;
  // }

  // & span:last-child {
  //   color: var(--color-grey-500);
  //   font-size: 1.2rem;
  // }
`;

const Qunatity = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function formatDate(timestamp) {
  return format(new Date(timestamp), "yyyy-MM-dd"); // Format: YYYY-MM-DD
}

function AvailableDonationRow({
  available: {
    id,
    donation_id: donationID,
    created_at,
    food_name: item,
    quantity,
    status,
  },
}) {
  const navigate = useNavigate();
  const statusToTagName = {
    pending: "silver",
    accepted: "green",
  };

  return (
    <Table.Row>
      <Numericals>{donationID}</Numericals>
      <Stacked>
        <span>{item}</span>
      </Stacked>
      <Qunatity style={{ marginLeft: "2.5rem" }}>{quantity}</Qunatity>
      <Qunatity
        style={{
          justifyContent: "center",
        }}
      >
        {formatDate(created_at)}
      </Qunatity>

      <Tag type={statusToTagName[status.toLowerCase()]}>
        {status.replace("-", " ")}
      </Tag>
      <Menus.Menu>
        <Menus.Toggle id={donationID} />
        <Menus.List id={donationID}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/available_donations/${donationID}`)}
          >
            See Details
          </Menus.Button>
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  );
}

export default AvailableDonationRow;
