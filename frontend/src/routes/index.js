import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

// layouts
import DashboardLayout from "../layouts/dashboard";

// config
import { DEFAULT_PATH } from "../config";
import LoadingScreen from "../components/LoadingScreen";
import LoginPage from "../pages/auth/LoginPage.jsx";
import MainLayout from "../layouts/main/index.js";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.jsx";
import NewPasswordPage from "../pages/auth/NewPasswordPage.jsx";

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: "/auth",
      element: <MainLayout />,
      children: [
        { element: <LoginPage />, path: "login" },
        { element: <RegisterPage />, path: "register" },
        { element: <ResetPasswordPage />, path: "reset-password" },
        { element: <NewPasswordPage />, path: "new-password" },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: "app", element: <GeneralApp /> },
        { path: "settings", element: <Settings /> },
        { path: "group", element: <GroupPage /> },
        { path: "call", element: <CallPage /> },
        { path: "profile", element: <ProfilePage /> },

        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(
  lazy(() => import("../pages/dashboard/GeneralApp.jsx")),
);

const GroupPage = Loadable(
  lazy(() => import("../pages/dashboard/Group.jsx")),
);

const Login = Loadable(
  lazy(() => import("../pages/auth/LoginPage.jsx"))
);

const Register = Loadable(
  lazy(() => import("../pages/auth/RegisterPage.jsx"))
);

const ResetPassword = Loadable(
  lazy(() => import("../pages/auth/ResetPasswordPage.jsx"))
);

const NewPassword = Loadable(
  lazy(() => import("../pages/auth/NewPasswordPage.jsx"))
);

const Settings = Loadable(
  lazy(() => import("../pages/dashboard/Settings.jsx")),
);

const CallPage = Loadable(
  lazy(() => import("../pages/dashboard/Call.jsx")),
);

const ProfilePage = Loadable(
  lazy(() => import("../pages/dashboard/Profile.jsx")),
);

const Page404 = Loadable(lazy(() => import("../pages/Page404")));
