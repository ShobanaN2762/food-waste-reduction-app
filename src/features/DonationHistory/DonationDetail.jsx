import styled from "styled-components";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useDonationHistory } from "./useDonationHistory";

import DonationDataBox from "./DonationDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Spinner from "../../ui/Spinner";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function DonationDetail() {
  const { olddonation, isLoading } = useDonationHistory();
  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;
  if (!olddonation) {
    return <div>Donation not found or data is loading...</div>;
  }

  const { status, donation_id: donationID } = olddonation;

  const statusToTagName = {
    deleted: "red",
    delivered: "green",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Donation #{donationID}</Heading>
          <Tag type={statusToTagName[status] || "grey"}>
            {status?.replace("-", " ") || ""}
          </Tag>
        </HeadingGroup>
        {/* <ButtonText onClick={moveBack}>&larr; Back</ButtonText> */}
      </Row>

      <DonationDataBox olddonation={olddonation} />

      <ButtonGroup>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default DonationDetail;
