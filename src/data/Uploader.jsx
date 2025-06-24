import { useState } from "react";
import supabase from "../services/supabase";
import Button from "../ui/Button";

import { foodDonations } from "./donations-data";

async function deleteDonations() {
  const { error } = await supabase
    .from("food_donation")
    .delete()
    .gt("donation_id", 0);
  if (error) console.log(error.message);
}

async function createDonations() {
  const { error } = await supabase.from("food_donation").insert(foodDonations);
  if (error) console.log(error.message);
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadBookings() {
    setIsLoading(true);
    await deleteDonations();
    await createDonations();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload
      </Button>
    </div>
  );
}

export default Uploader;
