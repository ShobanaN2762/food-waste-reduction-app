import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmUpdate = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmUpdate({ resourceName, onConfirm, disabled, onCloseModal }) {
  return (
    <StyledConfirmUpdate>
      <Heading as="h3">Update {resourceName}</Heading>
      <p>
        Are you sure you want to update this {resourceName} to fulfilled status?
        This action cannot be undone.
      </p>

      <div>
        <Button
          variations="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variations="danger" disabled={disabled} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </StyledConfirmUpdate>
  );
}

export default ConfirmUpdate;
