import React, { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Input from "../../ui/Input";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import Heading from "../../ui/Heading";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import { useGeolocation } from "../../hooks/useGeoLocation";
import { useNewDonation } from "./useNewDonation";
import { useEditDonation } from "./useEditDonation";
import styled from "styled-components";
import { calculateDistance } from "../../utils/helpers";
import { useRecipientRequests } from "./useRecipientRequests";

const Select = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
`;

const MapWrapper = styled.div`
  height: 300px;
  width: 100%;
  margin-top: 10px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
`;

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const recipientIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function NewDonationForm({ donationToEdit = {}, onCloseModal }) {
  const queryClient = useQueryClient();
  const { isCreating, newDonation } = useNewDonation();
  const { isEditing, editDonation } = useEditDonation();
  const isWorking = isCreating || isEditing;

  const [address, setAddress] = useState("");
  const [undoVisible, setUndoVisible] = useState(false);
  const { donation_id: editId, ...editValues } = donationToEdit;
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

  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const mapRef = useRef();

  // Fetch recipient requests with React Query
  const {
    data: recipientRequests = [],
    // isLoading: isLoadingRecipients,
    // error,
  } = useRecipientRequests();

  // Filter recipients within 10km radius
  const filteredRecipients = React.useMemo(() => {
    if (!position?.lat || !position?.lng) return recipientRequests;

    return recipientRequests.filter((recipient) => {
      if (!recipient.recipient_lat || !recipient.recipient_lng) return false;

      const distance = calculateDistance(
        position.lat,
        position.lng,
        parseFloat(recipient.recipient_lat),
        parseFloat(recipient.recipient_lng)
      );

      return distance <= 10; // 10km radius
    });
  }, [position, recipientRequests]);

  // Center map on donor location when position changes
  React.useEffect(() => {
    if (position?.lat && position?.lng && mapRef.current) {
      mapRef.current.setView([position.lat, position.lng], 13);
    }
  }, [position]);

  // Fetch address when position changes
  React.useEffect(() => {
    if (position) {
      (async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
          );
          const data = await response.json();
          const formattedAddress = data.display_name || "Address not found";

          setAddress(formattedAddress);
          setValue("donor_address", formattedAddress);
        } catch (error) {
          console.error("Error fetching address:", error);
          setAddress("Error fetching address");
          setValue("donor_address", "Error fetching address");
        }
      })();
    }
  }, [position, setValue]);

  // Update form when recipient location changes
  React.useEffect(() => {
    if (recipientLocation.address) {
      setValue("recipient_location", recipientLocation.address);
    }
  }, [recipientLocation, setValue]);

  const handleGetLocation = () => getPosition();

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
    setUndoVisible(true);

    // Set recipientLocation for form fields
    setRecipientLocation({
      lat: parseFloat(recipient.recipient_lat),
      lng: parseFloat(recipient.recipient_lng),
      address: recipient.recipient_location,
    });

    if (recipient.recipient_lat && recipient.recipient_lng && mapRef.current) {
      mapRef.current.flyTo(
        [
          parseFloat(recipient.recipient_lat),
          parseFloat(recipient.recipient_lng),
        ],
        14 // zoomed but not too much
      );
    }
  };

  const handleUndoSelection = () => {
    setSelectedRecipient(null);
    setUndoVisible(false);
  };

  async function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    const baseData = {
      ...data,
      donor_address: data.donor_address || address,
      donor_lat: position?.lat || null,
      donor_lng: position?.lng || null,
      status: "pending",
    };

    // If no recipient selected, donation is available to all
    const donationData = selectedRecipient
      ? {
          ...baseData,
          recipient_location: selectedRecipient.recipient_location,
          recipient_lat: parseFloat(selectedRecipient.recipient_lat),
          recipient_lng: parseFloat(selectedRecipient.recipient_lng),
          recipient_id: selectedRecipient.recipient_id,
        }
      : {
          ...baseData,
          recipient_location: recipientLocation.address || "",
          recipient_lat: recipientLocation.lat || null,
          recipient_lng: recipientLocation.lng || null,
          recipient_id: null,
        };

    const onSuccess = () => {
      reset();
      onCloseModal?.();
      queryClient.invalidateQueries(["donations"]);
    };

    if (isEditSession) {
      editDonation(
        { newDonationdata: { ...donationData, image }, id: editId },
        { onSuccess }
      );
    } else {
      newDonation({ ...donationData, image }, { onSuccess });
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
      style={{ maxHeight: "80vh", overflowY: "auto", padding: "20px" }}
    >
      <Heading as="h2" style={{ display: "flex", justifyContent: "center" }}>
        Donation Form
      </Heading>
      <FormRow label="Item" error={errors?.food_name?.message}>
        <Input
          type="text"
          disabled={isWorking}
          {...register("food_name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Quantity (in Kg)" error={errors?.quantity?.message}>
        <Input
          type="number"
          disabled={isWorking}
          {...register("quantity", {
            required: "This field is required",
            min: { value: 1, message: "Quantity should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Category" error={errors?.category?.message}>
        <Select
          disabled={isWorking}
          {...register("category", { required: "Please select a category" })}
        >
          <option value="">-- Select Category --</option>
          <option value="fruits&vegies">Fruits & Vegetables</option>
          <option value="grains">Grains & Rice</option>
          <option value="dairyProducts">Dairy Products</option>
          <option value="cookedMeals">Cooked Meals</option>
          <option value="others">Others</option>
        </Select>
      </FormRow>

      <FormRow label="Expiry Date" error={errors?.expiry_date?.message}>
        <Input
          type="date"
          disabled={isWorking}
          min={new Date().toISOString().split("T")[0]}
          {...register("expiry_date", {
            required: "This field is required",
            validate: (value) => {
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return (
                selectedDate >= today || "Expiry date cannot be in the past"
              );
            },
          })}
        />
      </FormRow>

      {/* Location */}
      <FormRow
        label="Your Location"
        error={errors?.donor_address?.message}
        style={{ justifyContent: "flex-start" }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.8rem",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Input
            type="text"
            value={address}
            readOnly
            disabled={isWorking}
            style={{ flex: 1 }}
          />
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={isFetchingLocation}
            style={{ whiteSpace: "nowrap" }}
          >
            {isFetchingLocation ? "Fetching..." : "Get Location"}
          </Button>
        </div>
      </FormRow>
      {/* Map */}
      <MapWrapper>
        <MapContainer
          center={[20.5937, 78.9629]} // Default location (India)
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Donor's location marker */}
          {position && (
            <Marker position={[position.lat, position.lng]} icon={customIcon}>
              <Popup>Recipient Location</Popup>
            </Marker>
          )}

          {/* Recipient markers */}
          {filteredRecipients.map((req) => {
            if (!req.recipient_lat || !req.recipient_lng) return null;

            const isSelected = selectedRecipient?.request_id === req.request_id;

            return (
              <Marker
                key={req.request_id}
                position={[
                  parseFloat(req.recipient_lat),
                  parseFloat(req.recipient_lng),
                ]}
                icon={isSelected ? customIcon : recipientIcon}
                eventHandlers={{
                  click: () => handleRecipientSelect(req),
                }}
              >
                <Popup>{req.recipient_location}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </MapWrapper>

      {/* Undo button if recipient is selected */}
      {undoVisible && (
        <Button type="button" onClick={handleUndoSelection}>
          Undo Selection
        </Button>
      )}

      <FormRow label="Image of Donation (optional)">
        <FileInput
          disabled={isWorking}
          accept="image/*"
          {...register("image")}
        />
      </FormRow>

      <FormRow>
        <Button disabled={isWorking} type="submit">
          {isWorking
            ? "Saving..."
            : isEditSession
            ? "Update Donation"
            : "Save Donation"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default NewDonationForm;
