import styled from "styled-components";

import NewDonationDataBox from "./NewDonationDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNewDonationHistory } from "./useNewDonationHistory";
import Spinner from "../../ui/Spinner";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function NewDonationDetail() {
  const { collection, isLoading } = useNewDonationHistory();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;

  const { status, donation_id: donationID } = collection;

  const statusToTagName = {
    rejected: "red",
    received: "green",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Donation #{donationID}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <NewDonationDataBox collection={collection} />

      <ButtonGroup>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default NewDonationDetail;
