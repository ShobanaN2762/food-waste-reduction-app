import NewDonationForm from "./NewDonationForm";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

function AddDonation() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="donation-form">
          <Button>Donate</Button>
        </Modal.Open>
        <Modal.Window name="donation-form">
          <NewDonationForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

// function AddDonation() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal((show) => !show)}>
//         Donate Now!
//       </Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <NewDonationForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }
export default AddDonation;
