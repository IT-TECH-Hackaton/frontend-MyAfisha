import AdminPage from "@modules/admin/components/adminPage/AdminPage";
import {
  AuthLayout,
  EmailVerifyPage,
  ForgotPasswordPage,
  OAuthCallbackPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage
} from "@modules/auth";
import { EventDetailsPage } from "@modules/events/EventDetailsPage";
import { TicketsPage } from "@modules/events/TicketsPage";
import { ProfilePage } from "@modules/user/profile";
import { createBrowserRouter } from "react-router-dom";

import { PATHS } from "@shared/constants";

import { MainLayout } from "./MainLayout";
import { NotFoundPage } from "./NotFoundPage";
import { PrivateRoute } from "./PrivateRoute";
import RootPage from "./RootPage";
import { AboutPage } from "./pages/AboutPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ContactsPage } from "./pages/ContactsPage";

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
      },
      {
        path: PATHS.OAUTH_CALLBACK,
        element: <OAuthCallbackPage />
      }
    ]
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <RootPage />
      },
      {
        path: "/events/:id",
        element: <EventDetailsPage />
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: PATHS.PROFILE,
            element: <ProfilePage />
          },
          {
            path: PATHS.TICKETS,
            element: <TicketsPage />
          },
          {
            path: PATHS.ADMIN,
            element: <AdminPage />
          }
        ]
      },
      {
        path: PATHS.ABOUT,
        element: <AboutPage />
      },
      {
        path: PATHS.TERMS,
        element: <TermsPage />
      },
      {
        path: PATHS.PRIVACY,
        element: <PrivacyPage />
      },
      {
        path: PATHS.CONTACTS,
        element: <ContactsPage />
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);
