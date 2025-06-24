import { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import Table from "../../ui/Table";
import DonationRequestRow from "./DonationRequestRow";
import { useDonationRequest } from "./useDonationRequest";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import supabase from "../../services/supabase";
import { useQueryClient } from "@tanstack/react-query";

function DonationRequestTable() {
  const { isLoading, requests } = useDonationRequest();
  const queryClient = useQueryClient();

  // 🔄 Realtime hook for automatic updates
  useEffect(() => {
    const channel = supabase
      .channel("realtime-recipient-request")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recipient_request" },
        (payload) => {
          console.log("🔁 Realtime change detected:", payload);
          queryClient.invalidateQueries({ queryKey: ["donation_request"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) return <Spinner />;

  if (!requests || requests.length === 0)
    return <Empty resourceName="donation" />;

  return (
    <Menus>
      <Table columns="5fr 4fr 5fr 3fr 3fr .7fr">
        <Table.Header>
          <div>ID</div>
          <div>Quantity</div>
          <div>Urgency</div>
          <div>Status</div>
        </Table.Header>
        <Table.Body
          data={requests}
          render={(request) => (
            <DonationRequestRow request={request} key={request.request_id} />
          )}
        />
      </Table>
    </Menus>
  );
}

export default DonationRequestTable;
