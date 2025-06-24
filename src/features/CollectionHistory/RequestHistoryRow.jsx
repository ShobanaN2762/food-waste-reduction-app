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

const Qunatity = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function formatDate(timestamp) {
  return format(new Date(timestamp), "yyyy-MM-dd"); // Format: YYYY-MM-DD
}

function RequestHistoryRow({
  request: { request_id: requestID, requested_at, quantity_needed, status },
}) {
  const navigate = useNavigate();
  const statusToTagName = {
    fullfilled: "green",
    deleted: "red",
  };

  return (
    <Table.Row>
      <Numericals>{requestID}</Numericals>

      <Qunatity style={{ marginLeft: "2.5rem" }}>{quantity_needed}</Qunatity>
      <Qunatity
        style={{
          justifyContent: "center",
        }}
      >
        {formatDate(requested_at)}
      </Qunatity>

      <Tag type={statusToTagName[status.toLowerCase()]}>
        {status.replace("-", " ")}
      </Tag>
      <Menus.Menu>
        <Menus.Toggle id={requestID} />
        <Menus.List id={requestID}>
          <Menus.Button
            icon={<HiEye />}
            onClick={() => navigate(`/request-histories/${requestID}`)}
          >
            See Details
          </Menus.Button>
        </Menus.List>
      </Menus.Menu>
    </Table.Row>
  );
}

export default RequestHistoryRow;
