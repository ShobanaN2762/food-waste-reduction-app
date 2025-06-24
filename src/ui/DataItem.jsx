import styled from "styled-components";

const StyledDataItem = styled.div`
  display: table-row; /* Makes it behave like a table row */
`;

const Label = styled.div`
  display: table-cell;
  padding: 0.8rem 1.6rem;
  font-weight: 600;
  vertical-align: top;
  color: var(--color-grey-700);
  white-space: nowrap;

  & svg {
    margin-right: 0.8rem;
    vertical-align: middle;
    color: var(--color-brand-600);
  }
`;

const Value = styled.div`
  display: table-cell;
  padding: 0.8rem 1.6rem;
  color: var(--color-grey-900);
`;

function DataItem({ icon, label, children }) {
  return (
    <StyledDataItem>
      <Label>
        {icon}
        {label}
      </Label>
      <Value>{children}</Value>
    </StyledDataItem>
  );
}

export default DataItem;
