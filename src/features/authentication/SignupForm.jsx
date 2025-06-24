import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRowVertical from "../../ui/FormRowVertical";
import Input from "../../ui/Input";
import { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSignup } from "./useSignup";
import FormRow from "../../ui/FormRow";

// Email regex for validation
const EMAIL_REGEX = /\S+@\S+\.\S+/;

// Styled components for radio buttons
const RadioButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--color-grey-700);
`;

const RadioButtonInput = styled.input`
  margin: 0;
  width: 2rem;
  height: 2rem;
  accent-color: var(--color-brand-600); // Change the color of the radio button
  cursor: pointer;
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LoginLink = styled.span`
  color: var(--color-brand-600);
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: var(--color-brand-700);
  }
`;

function SignupForm() {
  const { signup, isLoading } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const [titlerole, setTitleRole] = useState("donor");
  const navigate = useNavigate();

  function handleRoleChange(e) {
    setTitleRole(e.target.value);
    console.log("Selected Role:", e.target.value); // ✅ Debug role selection
  }

  function handleCancel() {
    navigate("/login");
  }

  function onSubmit({ fullName, email, password, address, phoneNumber }) {
    signup(
      { fullName, email, password, titlerole, address, phoneNumber },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRowVertical label="Sign up as" error={errors.role?.message}>
        <RadioButtonContainer>
          <RadioButtonLabel>
            <RadioButtonInput
              type="radio"
              name="titlerole"
              value="donor"
              checked={titlerole === "donor"}
              onChange={handleRoleChange}
            />
            Donor
          </RadioButtonLabel>
          <RadioButtonLabel>
            <RadioButtonInput
              type="radio"
              name="titlerole"
              value="recipient"
              checked={titlerole === "recipient"}
              onChange={handleRoleChange}
            />
            Recipient
          </RadioButtonLabel>
        </RadioButtonContainer>
      </FormRowVertical>

      <FormRowVertical label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRowVertical>

      <FormRowVertical label="Email address" error={errors.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: EMAIL_REGEX,
              message: "Invalid email address.",
            },
          })}
        />
      </FormRowVertical>

      <FormRowVertical
        label="Password (min 8 characters)"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
          })}
        />
      </FormRowVertical>

      <FormRowVertical
        label="Repeat password"
        error={errors?.passwordConfirm?.message}
      >
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) =>
              value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRowVertical>

      <FormRowVertical label="Address" error={errors.address?.message}>
        <Input
          type="text"
          id="address"
          disabled={isLoading}
          {...register("address", { required: "Address is required." })}
        />
      </FormRowVertical>

      <FormRowVertical label="Phone Number" error={errors.phoneNumber?.message}>
        <Input
          type="tel"
          id="phoneNumber"
          {...register("phoneNumber", {
            required: "Phone number is required.",
          })}
        />
      </FormRowVertical>

      <FormRow>
        <div style={{ flex: 1 }}>
          <Button
            variation="secondary"
            type="reset"
            disabled={isLoading}
            onClick={reset}
          >
            Cancel
          </Button>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button disabled={isLoading} type="submit">
            Create Account
          </Button>
        </div>
      </FormRow>

      <LoginContainer>
        <span>Already have an account? Click here to</span>
        <LoginLink onClick={handleCancel}>Login</LoginLink>
      </LoginContainer>
    </Form>
  );
}

export default SignupForm;
