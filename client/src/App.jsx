
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Dashboard, EditUser, HomeLayout, Landing, Login, Logout, Register } from "./pages";
import { ToastContainer, toast } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "edit/:userId",
        element: <EditUser />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      
    ],
  },
]);

function App() {


  return (
    <>
        <RouterProvider router={router} />
        <ToastContainer position='top-center' />
    </>
  )
}

export default App
