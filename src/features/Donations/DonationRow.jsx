import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi2";

import NewDonationForm from "./NewDonationForm";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteDonation } from "./useDeleteDonation";
import Menus from "../../ui/Menus";
import Tag from "../../ui/Tag";

const Donate = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const statusToTagName = {
  pending: "silver",
  accepted: "green",
  "pickup confirmed": "blue",
};

function DonationRow({ donation }) {
  const { donation_id, food_name, category, quantity, status } = donation;
  const { isDeleting, deleteDonation } = useDeleteDonation();

  return (
    <Table.Row>
      <Donate>{donation_id}</Donate>
      <Donate>{food_name}</Donate>
      <Donate>{category}</Donate>
      <Donate>{quantity}</Donate>
      <Tag type={statusToTagName[status.toLowerCase()]}>
        {status.replace("-", " ")}
      </Tag>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={donation_id} />
            <Menus.List id={donation_id}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <NewDonationForm donationToEdit={donation} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="donation"
                disabled={isDeleting}
                onConfirm={() => deleteDonation(donation_id)}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}
export default DonationRow;
