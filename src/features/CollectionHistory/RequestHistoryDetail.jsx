import styled from "styled-components";

import RequestHistoryDataBox from "./RequestHistoryDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Spinner from "../../ui/Spinner";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useRequestHistory } from "./useRequestHistory";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function RequestHistoryDetail() {
  const { request, isLoading } = useRequestHistory();

  const moveBack = useMoveBack();

  if (isLoading) return <Spinner />;

  const { status, request_id: requestID } = request;

  const statusToTagName = {
    deleted: "red",
    fullfilled: "green",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Request #{requestID}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <RequestHistoryDataBox request={request} />

      <ButtonGroup>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default RequestHistoryDetail;
