import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import LandingPage from "./layouts/public/LandingPage.jsx";
import VendorHome from "./layouts/private/Vendor/VendorHome.jsx";
import CustomerHome from "./layouts/private/Customer/CustomerHome.jsx";
import Dashboard from "./layouts/private/Vendor/Dashboard.jsx";
import Dashmain from "./layouts/private/Vendor/Admin/Dashmain.jsx";
import ManageRoles from "./layouts/private/Vendor/Admin/ManageRoles.jsx";
import ManageRestaurant from "./layouts/private/Vendor/Manager/ManageRestaurent.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/vendorhome",
    element: <VendorHome />,
  },
  {
    path: "/customerhome",
    element: <CustomerHome />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "admin-analytics",
        element: <Dashmain />,
      },
      {
        path: "manage-roles/:id",
        element: <ManageRoles />,
      },
      {
        path:"manage-restaurant",
        element:<ManageRestaurant/>
      }
    ],
  },
]);

function App() {
  return (
    <>
      <Provider store={store}>
        <Toaster />
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
