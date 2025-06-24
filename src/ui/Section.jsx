import styled, { css } from "styled-components";

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;

  ${(props) =>
    props.type === "box" &&
    css`
      /* Box */
      background-color: var(--color-grey-0);
      border: 1px solid var(--color-grey-100);
      border-radius: var(--border-radius-md);

      overflow: hidden;
    `}
`;
export default Section;
