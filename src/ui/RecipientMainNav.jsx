import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineHome, HiOutlineUser } from "react-icons/hi2";
import { MdOutlineHistory } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StyledNavLink = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;

    color: var(--color-grey-600);
    font-size: 1.6rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-50);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-brand-600);
  }
`;

function RecipientMainNav() {
  return (
    <nav>
      <NavList>
        <li>
          <StyledNavLink to="/recipient-dashboard">
            <HiOutlineHome />
            <span>Home</span>
          </StyledNavLink>
        </li>

        <li>
          <StyledNavLink to="/available-donation">
            <FaSearch />
            <span>Find Donations</span>
          </StyledNavLink>
        </li>

        <li>
          <StyledNavLink to="/collection-history">
            <MdOutlineHistory />
            <span>Collection History</span>
          </StyledNavLink>
        </li>

        <li>
          <StyledNavLink to="/recipient-account">
            <HiOutlineUser />
            <span>My Account</span>
          </StyledNavLink>
        </li>
      </NavList>
    </nav>
  );
}

export default RecipientMainNav;
