import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { DeleteAccount } from "./pages/DeleteAccountPage";
import RegisterationPage from "./pages/RegisterationForm";
import { TermsOfService } from "./pages/TermsofService";

function App() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
    },
    {
      path: "/delete-account",
      element: <DeleteAccount />,
    },
    {
      path: "/register",
      element: <RegisterationPage />,
    },
    {
      path: "/terms-of-service",
      element: <TermsOfService />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
