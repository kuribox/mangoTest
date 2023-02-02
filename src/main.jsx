import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./views/Home";
import Exercice1 from "./views/Exercice1";
import Exercice2 from "./views/Exercice2";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/exercise1",
    element: <Exercice1 />,
  },
  {
    path: "/exercise2",
    element: <Exercice2 />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
