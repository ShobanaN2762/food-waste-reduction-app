import React, { useState, useEffect } from "react";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import Textarea from "../../ui/Textarea";
import styled from "styled-components";
import Heading from "../../ui/Heading";

import { useForm } from "react-hook-form";
import { useGeolocation } from "../../hooks/useGeoLocation";
import { useNewRequestDonation } from "./useNewRequestDonation";
import { useEditRequestDonation } from "./useEditRequestDonation";

const Select = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

function NewRequestForm({ requestToEdit = {}, onCloseModal }) {
  const { isCreating, newRequest } = useNewRequestDonation();
  const { isEditing, editRequest } = useEditRequestDonation();
  const isWorking = isCreating || isEditing;

  const { request_id: editId, ...editValues } = requestToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const {
    isLoading: isFetchingLocation,
    position,
    getPosition,
  } = useGeolocation();

  const [recipientLocation, setRecipientLocation] = useState({
    lat: null,
    lng: null,
    address: "",
  });

  useEffect(() => {
    if (position) {
      (async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
          );
          const data = await response.json();
          const formattedAddress = data.display_name || "Address not found";

          setRecipientLocation({
            lat: position.lat,
            lng: position.lng,
            address: formattedAddress,
          });

          setValue("recipient_location", formattedAddress);
        } catch (error) {
          console.error("Error fetching address:", error);
          setRecipientLocation((prev) => ({
            ...prev,
            address: "Error fetching address",
          }));
          setValue("recipient_location", "Error fetching address");
        }
      })();
    }
  }, [position, setValue]);

  // ✅ FIXED: Define handler for "Get Location" button
  const handleGetLocation = () => {
    getPosition();
  };

  async function onSubmit(data) {
    const donationData = {
      ...data,
      recipient_location: recipientLocation.address,
      recipient_lat: recipientLocation.lat,
      recipient_lng: recipientLocation.lng,
      status: "pending",
    };

    if (isEditSession)
      editRequest(
        { newDonationdata: { ...donationData }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      newRequest(
        { ...donationData },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ maxHeight: "80vh", overflowY: "auto", padding: "20px" }}
    >
      <Heading as="h2" style={{ display: "flex", justifyContent: "center" }}>
        Donation Request Form
      </Heading>

      <FormRow label="Quantity (in Kg)" error={errors?.quantity?.message}>
        <Input
          type="number"
          disabled={isWorking}
          {...register("quantity_needed", {
            required: "This field is required",
            min: { value: 1, message: "Quantity should be at least 5" },
          })}
        />
      </FormRow>

      <FormRow label="Urgency Level" error={errors?.urgency_level?.message}>
        <Select
          disabled={isWorking}
          {...register("urgency_level", {
            required: "Please select an urgency level",
          })}
        >
          <option value="">-- Select Urgency level --</option>
          <option value="low">Low</option>
          <option value="high">High</option>
        </Select>
      </FormRow>

      <FormRow
        label="Your Location"
        disabled={isWorking}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        }}
        error={errors?.recipient_location?.message}
      >
        <div style={{ width: "100%" }}>
          <Input
            type="text"
            value={recipientLocation.address}
            readOnly
            style={{
              padding: "12px",
              height: "42px",
              width: "100%",
              textAlign: "left",
            }}
          />
        </div>

        <div style={{ width: "100%" }}>
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={isFetchingLocation}
            style={{ width: "100%", height: "42px" }}
          >
            {isFetchingLocation ? "Fetching..." : "Get Location"}
          </Button>
        </div>
      </FormRow>

      <FormRow label="Message" error={errors?.message?.message}>
        <Textarea
          type="text"
          disabled={isWorking}
          {...register("message", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={onCloseModal}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession
            ? "Edit"
            : isCreating
            ? "Placing Request..."
            : "Request Donation"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default NewRequestForm;
