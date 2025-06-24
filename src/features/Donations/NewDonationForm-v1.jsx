import styled from "styled-components";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import { newDonation } from "../../services/apiFoodDonation";
// import Textarea from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FormRow from "../../ui/FormRow";

function NewDonationForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // console.log(errors);

  const queryClient = useQueryClient();

  const { mutate, isLoading: isCreating } = useMutation({
    mutationFn: newDonation,
    onSuccess: () => {
      toast.success("Donation alert placed!");
      queryClient.invalidateQueries({ queryKey: ["donation"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    mutate({ ...data, image: data.image[0] });
  }

  function onError(errors) {
    // console.log(errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Item" error={errors?.food_name?.message}>
        <Input
          type="text"
          id="food_name"
          disabled={isCreating}
          {...register("food_name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Quantity (in Kg)" error={errors?.quantity?.message}>
        <Input
          type="number"
          id="quantity"
          disabled={isCreating}
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
          disabled={isCreating}
          {...register("expiry_date", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Location" error={errors?.location?.message}>
        <Input
          type="text"
          id="location"
          disabled={isCreating}
          {...register("location", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="image" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          {...register("image", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isCreating}> Donate</Button>
      </FormRow>
    </Form>
  );
}

export default NewDonationForm;
