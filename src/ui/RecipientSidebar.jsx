import styled from "styled-components";
import Logo from "./Logo";
import RecipientMainNav from "./RecipientMainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-bottom: 1px solid var(--color-grey-100);
  grid-row: 1/-1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function RecipientSidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <RecipientMainNav />
    </StyledSidebar>
  );
}
export default RecipientSidebar;
