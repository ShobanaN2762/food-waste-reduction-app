import styled from "styled-components";
import SignupForm from "../features/authentication/SignupForm.jsx";
import Logo from "../ui/Logo.jsx";
import Heading from "../ui/Heading.jsx";

const SingupLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

function Signup() {
  return (
    <SingupLayout>
      <Logo />
      <Heading as="h4"> Signup</Heading>
      <SignupForm />
    </SingupLayout>
  );
}

export default Signup;
