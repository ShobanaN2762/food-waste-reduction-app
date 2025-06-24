import NewDonationForm from "./NewDonationForm";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

function RequestDonation() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="request-form">
          <Button>Request</Button>
        </Modal.Open>
        <Modal.Window name="request-form">
          <NewDonationForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default RequestDonation;
