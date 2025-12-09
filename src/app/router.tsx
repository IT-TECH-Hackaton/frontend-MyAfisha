import {
  AuthLayout,
  SignInPage,
  SignUpPage,
  EmailVerifyPage,
  ForgotPasswordPage,
  ResetPasswordPage
} from "@modules/auth";
import { ProfilePage } from "@modules/user/profile";
import { createBrowserRouter } from "react-router-dom";

import { PATHS } from "@shared/constants";

import { PrivateRoute } from "./PrivateRoute";
import { RootPage } from "./RootPage";

export const routes = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: PATHS.SIGNIN,
        element: <SignInPage />
      },
      {
        path: PATHS.SIGNUP,
        element: <SignUpPage />
      },
      {
        path: PATHS.EMAIL_VERIFY,
        element: <EmailVerifyPage />
      },
      {
        path: PATHS.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />
      },
      {
        path: PATHS.RESET_PASSWORD,
        element: <ResetPasswordPage />
      }
    ]
  },
  {
    path: "/",
    element: <RootPage />
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: PATHS.PROFILE,
        element: <ProfilePage />
      }
    ]
  }
]);
