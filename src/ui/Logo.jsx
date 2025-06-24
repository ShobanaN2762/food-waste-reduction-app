import styled from "styled-components";
import Row from "./Row";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 10rem;
  width: auto;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode ? "/logo2.jpg" : "/logo2.jpg";
  return (
    <StyledLogo>
      <Img src={src} alt="Logo" />
      <Row>
        <b>HungerBowl</b>
      </Row>
    </StyledLogo>
  );
}

export default Logo;
