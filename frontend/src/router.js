import { createBrowserRouter } from "react-router-dom";
import App from "./routes/App";
import Login from "./routes/Login";
import Signup from "./routes/Signup";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/auth",
      children:[
        {
          path: "login",
          element: <Login />
        },
        {
          path: "signup",
          element: <Signup />
        }
      ]
    }
]);