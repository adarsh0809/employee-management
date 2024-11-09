import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ErrorPage from "./pages/ErrorPage.jsx"; // Adjust path
import Login from "./pages/Login.jsx"; // Adjust path
import Register from "./pages/Register.jsx"; // Adjust path
import Dashboard from "./pages/Dashboard.jsx"; // Adjust path
import CreateEmployee from "./pages/CreateEmployee.jsx"; // Adjust path
import DeleteEmployee from "./pages/DeleteEmployee.jsx"; // Adjust path
import EmployeeList from "./pages/EmployeeList.jsx"; // Adjust path
import Logout from "./pages/Logout.jsx"; // Adjust path
import UserProvider from "./context/userContext";
import Editdetails from "./pages/Editdetails.jsx";

// Define your routes here
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <UserProvider>
        <Layout />
      </UserProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/createEmployee", element: <CreateEmployee /> },
      { path: "/edit/:id", element: <Editdetails/> },
      { path: "/delete/:id", element: <DeleteEmployee /> },
      { path: "/employee-list", element: <EmployeeList /> },
      { path: "/logout", element: <Logout /> },
    ],
  },
]);

// Now return the RouterProvider in the App component
function App() {
  return <RouterProvider router={router} />;
}

export default App;
