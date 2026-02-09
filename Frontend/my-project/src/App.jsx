import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { useParams } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import TrackOrder from "./layouts/private/Customer/TrackOrder.jsx";

import LandingPage from "./layouts/public/LandingPage.jsx";
import VendorHome from "./layouts/private/Vendor/VendorHome.jsx";
import CustomerHome from "./layouts/private/Customer/CustomerHome.jsx";
import Dashboard from "./layouts/private/Vendor/Dashboard.jsx";
import Dashmain from "./layouts/private/Vendor/Admin/Dashmain.jsx";
import ManageRoles from "./layouts/private/Vendor/Admin/ManageRoles.jsx";
import ManageRestaurant from "./layouts/private/Vendor/Manager/ManageRestaurent.jsx";
import RestaurantProfile from "./layouts/private/Customer/RestaurantProfile.jsx";
import Cart from "./components/Cart.jsx";
import OrderSuccess from "./components/OrderSuccess.jsx";
import YourOrders from "./layouts/private/Customer/YourOrders.jsx";
import ManageOrders from "./layouts/private/Vendor/Manager/ManageOrders.jsx";
import OrderDetail from "./layouts/private/Vendor/Manager/OrderDetail.jsx";
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
    element: <CustomerHome/>,
  },
  {
    path: "/restaurants/:id",
    element:<RestaurantProfile />
  },
  {
    path:"/order-success",
    element:<OrderSuccess/>
  },
  {
    path:"/track-order/:orderId",
    element:<TrackOrder/>
  },
  {
    path: "/yourorder",
    element:<YourOrders/>
  },
  {
    path:"/orderdetails/:orderId",
    element:<OrderDetail/>
  }
  ,
  {
    path: "/cart/:id",
    element:<Cart/>
  }
  ,
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
      },
      {
        path:"manage-orders",
        element:<ManageOrders/>
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
