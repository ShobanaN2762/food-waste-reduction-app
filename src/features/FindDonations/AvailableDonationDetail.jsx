import { useState } from "react";
import styled from "styled-components";
import { useMoveBack } from "../../hooks/useMoveBack";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";
import useAvailableDonationHistory from "./useAvailableDonationHistory";
import AvailableDonationDataBox from "./AvailableDonationDataBox";
import {
  markAsReceived,
  updateDonationStatus,
} from "../../services/apiDonation";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function AvailableDonationDetail() {
  const { available, isLoading, refetch } = useAvailableDonationHistory();
  const [localStatus, setLocalStatus] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null); // Added error state
  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;

  const { status: originalStatus, donation_id: donationID } = available;
  const status = localStatus || originalStatus || "pending";

  const statusToTagName = {
    pending: "silver",
    accepted: "green",
    "pickup confirmed": "blue",
    received: "green",
  };

  async function handleStatusChange() {
    if (isUpdating) return;
    setError(null);

    const statusTransitions = {
      pending: "accepted",
      accepted: "pickup confirmed",
      "pickup confirmed": "received",
    };

    const newStatus = statusTransitions[status];
    if (!newStatus) return;

    try {
      setIsUpdating(true);

      if (newStatus === "received") {
        await markAsReceived(donationID);
        moveBack(); // ✅ Navigate back immediately after marking as received
      } else {
        const updated = await updateDonationStatus(donationID, newStatus);
        setLocalStatus(updated.status);
        await refetch();
      }
    } catch (err) {
      setError(err.message || "Failed to update donation status");
      console.error("Status update error:", {
        donationID,
        currentStatus: status,
        targetStatus: newStatus,
        error: err,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  // Button label logic
  const getButtonLabel = () => {
    switch (status) {
      case "pending":
        return "Accept";
      case "accepted":
        return "Confirm Pickup";
      case "pickup confirmed":
        return "Received";
      default:
        return null;
    }
  };

  const buttonLabel = getButtonLabel();

  return (
    <>
      {/* Error display */}
      {error && (
        <div style={{ color: "red", margin: "1rem 0" }}>Error: {error}</div>
      )}

      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Donation #{donationID}</Heading>
          <Tag type={statusToTagName[status]}>{status?.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <AvailableDonationDataBox available={{ ...available, status }} />

      <ButtonGroup>
        {buttonLabel && (
          <Button
            variation="secondary"
            onClick={handleStatusChange}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : buttonLabel}
          </Button>
        )}
      </ButtonGroup>
    </>
  );
}
export default AvailableDonationDetail;
