import NewRequestForm from "./NewRequestForm";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

function AddRequest() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="request-form">
          <Button>Request</Button>
        </Modal.Open>
        <Modal.Window name="request-form">
          <NewRequestForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default AddRequest;
