import styled from "styled-components";
import ButtonIcon from "./ButtonIcon";
import { HiOutlineUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Logout from "../features/authentication/Logout";
import DarkModeToggle from "./DarkModeToggle";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.4rem;
`;

function HeaderMenu() {
  const navigate = useNavigate();

  // You can fetch role from context, session, or localStorage
  const userRole = localStorage.getItem("userRole"); // Example usage

  // Define the route based on role
  const accountRoute =
    userRole === "recipient" ? "/recipient-account" : "/donor-account";

  return (
    <StyledHeaderMenu>
      <li>
        <ButtonIcon onClick={() => navigate(accountRoute)}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <DarkModeToggle />
      </li>
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
