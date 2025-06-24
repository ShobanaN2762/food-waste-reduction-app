import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children, allowedRoles }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, role } = useUser();

  const hasRequiredRole = allowedRoles?.includes(role);

  useEffect(() => {
    console.log("ProtectedRoute check", {
      isAuthenticated,
      isLoading,
      role,
      allowedRoles,
      hasRequiredRole,
    });

    if (!isLoading) {
      if (!isAuthenticated || !hasRequiredRole) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, navigate]);

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
