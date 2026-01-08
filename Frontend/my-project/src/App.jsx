import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Toaster} from "react-hot-toast"
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import LandingPage from "./layouts/public/LandingPage.jsx";
import VendorHome from "./layouts/private/Vendor/VendorHome.jsx";
import CustomerHome from "./layouts/private/Customer/CustomerHome.jsx";
import AdminDashboard from "./layouts/private/Vendor/Admin/AdminDashboard.jsx";

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
]);

function App() {
  return (
    <>
    <Provider store={store}>
      <Toaster/>
      <RouterProvider router={router} />
    </Provider>
    </>
  );
}

export default App;
