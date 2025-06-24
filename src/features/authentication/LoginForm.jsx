import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CreateAccountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CreateAccountLink = styled.span`
  color: var(--color-brand-600);
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: var(--color-brand-700);
  }
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  }

  const handleCreateAccountClick = () => {
    navigate("/donor-signup");
  };

  const handleDemoRecipientLogin = () => {
    setEmail("papid17554@f5url.com");
    setPassword("qwerty123");
  };

  const handleDemoDonorLogin = () => {
    setEmail("corava2683@mobilesm.com");
    setPassword("qwerty123");
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FormRowVertical label="Email address">
          <Input
            type="email"
            id="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </FormRowVertical>
        <FormRowVertical label="Password">
          <Input
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </FormRowVertical>
        <FormRowVertical>
          <Button size="large" disabled={isLoading}>
            {!isLoading ? "Log in" : <SpinnerMini />}
          </Button>
        </FormRowVertical>
        <CreateAccountContainer>
          <span>Are you a new user?</span>
          <CreateAccountLink onClick={handleCreateAccountClick}>
            Create an account
          </CreateAccountLink>
        </CreateAccountContainer>
      </Form>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          Want to try the app Recipient?{" "}
          <button
            type="button"
            onClick={handleDemoRecipientLogin}
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Use demo login
          </button>
        </p>
      </div>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          Want to try the app as Donor?{" "}
          <button
            type="button"
            onClick={handleDemoDonorLogin}
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Use demo login
          </button>
        </p>
      </div>
    </>
  );
}

export default LoginForm;
