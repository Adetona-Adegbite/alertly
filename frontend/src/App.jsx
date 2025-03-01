import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";

function App() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "/register",
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
