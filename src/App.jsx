import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import DonorAccount from "./pages/DonorAccount.jsx";
import PageNotFound from "./pages/PageNotFound";
import DonorLayout from "./pages/DonorLayout.jsx";
import RecipientLayout from "./pages/RecipientLayout.jsx";
import Donation from "./pages/Donations.jsx";
import MyDonations from "./pages/MyDonations.jsx";
import MyDonation from "./pages/MyDonation.jsx";
import ProtectedRoute from "./ui/ProtectedRoute.jsx";
import Signup from "./pages/Signup.jsx";
import DarkModeProvider from "./context/DarkModeContext.jsx";
import RecipientDashboard from "./pages/RecipientDashboard.jsx";
import AvailableDonations from "./pages/AvailableDonations.jsx";
import CollectionHistory from "./pages/CollectionHistory.jsx";
import RecipientAccount from "./pages/RecipientAccount.jsx";
import NewDonation from "./pages/NewDonation.jsx";
import AvailableDonation from "./pages/AvailableDonation.jsx";
import RequestHistory from "./pages/RequestHistory.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export default function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            {/* Donor Application Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["donor"]}>
                  <DonorLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate replace to="donor-dashboard" />}
              />
              <Route path="donor-dashboard" element={<Dashboard />} />
              <Route path="donation" element={<Donation />} />
              <Route path="mydonation" element={<MyDonations />} />
              <Route path="mydonations/:donation_id" element={<MyDonation />} />
              <Route path="donor-account" element={<DonorAccount />} />
            </Route>

            {/* Recipient Application Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["recipient"]}>
                  <RecipientLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate replace to="recipient-dashboard" />}
              />
              <Route
                path="recipient-dashboard"
                element={<RecipientDashboard />}
              />
              <Route
                path="available-donation"
                element={<AvailableDonations />}
              />
              <Route
                path="available_donations/:donation_id"
                element={<AvailableDonation />}
              />
              <Route
                path="collection-history"
                element={<CollectionHistory />}
              />
              <Route
                path="collection-histories/:donation_id"
                element={<NewDonation />}
              />
              <Route
                path="request-histories/:request_id"
                element={<RequestHistory />}
              />
              <Route path="recipient-account" element={<RecipientAccount />} />
            </Route>

            {/* Public Routes */}
            <Route path="login" element={<Login />} />
            <Route path="donor-signup" element={<Signup />} />
            <Route path="recipient-signup" element={<Signup />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 5000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}
