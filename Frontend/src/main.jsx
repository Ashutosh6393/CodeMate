import "./index.css";
import React from "react";
import App from "./App.jsx";
import Room from "./pages/Room.jsx";
import Error from "./pages/Error.jsx";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import AppContextProvider from "./context/AppContextProvider.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "/room/:roomId",
    element: (
      <AppContextProvider>
        <Room />
      </AppContextProvider>
    ),
    errorElement: <Error />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
  </>
);
