import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";
import { useNewDonation } from "./useNewDonation";
import { useEditDonation } from "./useEditDonation";
import { useGeolocation } from "../../hooks/useGeoLocation"; // Import the custom hook
import { useEffect, useState } from "react"; // Add useEffect and useState

// API key = AlzaSyTGBvyMcU0ARAN5F6ykZN9FOIC0TYg0bNJ

function NewDonationForm({ donationToEdit = {}, onCloseModal }) {
  const { isCreating, newDonation } = useNewDonation();
  const { isEditing, editDonation } = useEditDonation();
  const isWorking = isCreating || isEditing;

  const { donation_id: editId, ...editValues } = donationToEdit;
  const isEditSession = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    setValue, // Add setValue from react-hook-form to programmatically set the location
    formState: { errors },
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  // Use the useGeolocation hook
  const {
    isLoading: isFetchingLocation,
    position,
    error: locationError,
    getPosition,
  } = useGeolocation();

  // State to store the human-readable address
  const [address, setAddress] = useState("");

  // Fetch the human-readable address using the Geocoding API
  useEffect(() => {
    if (position) {
      console.log("User's Current Coordinates:", position.lat, position.lng);

      const fetchAddress = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`
          );
          const data = await response.json();
          console.log("Nominatim API Response:", data); // Debugging

          if (data.display_name) {
            const formattedAddress = data.display_name;
            setAddress(formattedAddress);
            setValue("location", formattedAddress, { shouldValidate: true });
          } else {
            setAddress("Address not found");
            setValue("location", "Address not found");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setAddress("Error fetching address");
          setValue("location", "Error fetching address");
        }
      };

      fetchAddress();
    }
  }, [position, setValue]);

  // Handle location fetch
  const handleGetLocation = () => {
    getPosition();
    console.log(position);
  };

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    const locationData = {
      address: data.location, // Human-readable address
      coordinates: position, // Latitude and longitude
    };

    if (isEditSession)
      editDonation(
        {
          newDonationdata: { ...data, image, location: locationData },
          id: editId,
        },
        {
          onSuccess: (data) => {
            console.log(data);
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      newDonation(
        { ...data, image: image, location: locationData },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Item" error={errors?.food_name?.message}>
        <Input
          type="text"
          id="food_name"
          disabled={isWorking}
          {...register("food_name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Quantity (in Kg)" error={errors?.quantity?.message}>
        <Input
          type="number"
          id="quantity"
          disabled={isWorking}
          {...register("quantity", {
            required: "This field is required",
            min: {
              value: 5,
              message: "quantity should be atleast 5",
            },
          })}
        />
      </FormRow>

      <FormRow label="Expiry Date" error={errors?.expiry_date?.message}>
        <Input
          type="date"
          id="expiry_date"
          disabled={isWorking}
          {...register("expiry_date", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Location" error={errors?.location?.message}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Input
            type="text"
            id="location"
            disabled={isWorking || isFetchingLocation}
            style={{ marginLeft: "190px" }}
            {...register("location", { required: "This field is required" })}
          />
          <Button
            type="button"
            onClick={handleGetLocation}
            disabled={isFetchingLocation || isWorking}
            style={{ flexShrink: 0 }}
          >
            {isFetchingLocation ? "Fetching Location..." : "Get Location"}
          </Button>
        </div>
        {locationError && (
          <p style={{ color: "red", marginTop: "8px" }}>{locationError}</p>
        )}
      </FormRow>

      <FormRow label="image" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        ></Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit" : "Donate"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default NewDonationForm;
