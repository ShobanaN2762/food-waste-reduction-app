import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi2";

import NewRequestForm from "./NewRequestForm";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Tag from "../../ui/Tag";
import { useDeleteRequest } from "./useDeleteRequest";
import { useUpdateRequest } from "./useUpdateRequest";
import ConfirmUpdate from "../../ui/ConfirmUpdate";
import { RxUpdate } from "react-icons/rx";

const Div = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const statusToTagName = {
  pending: "silver",
  accepted: "green",
  "pickup confirmed": "yellow",
};

function DonationRequestRow({ request }) {
  const { request_id, urgency_level, status, quantity_needed } = request;
  const { isDeleting, deleteRequest } = useDeleteRequest();
  const { isUpdating, updateRequest } = useUpdateRequest();
  return (
    <Table.Row>
      <Div>{request_id}</Div>
      <Div>{quantity_needed}</Div>
      <Div>{urgency_level}</Div>
      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={request_id} />
            <Menus.List id={request_id}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="fulfilled">
                <Menus.Button icon={<RxUpdate />}>Fulfilled</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <NewRequestForm requestToEdit={request} />
            </Modal.Window>

            <Modal.Window name="fulfilled">
              <ConfirmUpdate
                resourceName="Request"
                disabled={isUpdating}
                onConfirm={() => updateRequest(request_id)}
              />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="Request"
                disabled={isDeleting}
                onConfirm={() => deleteRequest(request_id)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}
export default DonationRequestRow;
