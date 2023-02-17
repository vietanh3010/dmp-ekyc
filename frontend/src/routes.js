import React from "react";
import DefaultLayout from "./containers/DefaultLayout";

const Dashboard = React.lazy(() => import("./views/Dashboard"));

const ViewProject = React.lazy(() => import("./views/Projects/View/ViewProjects"));
const CreateProfile = React.lazy(() => import("./views/CreateProfile/CreateProfile"));
const UserList = React.lazy(() => import("./views/UserList/UserList"));
const History = React.lazy(() => import("./views/History/History"));
const HistoryFailed = React.lazy(() => import("./views/History/HistoryFailed"));
const ResetPassword = React.lazy(() => import("./views/Pages/ResetPassword"));
const Department = React.lazy(() => import("./views/Department/Department"));
// const TestProject = React.lazy(() => import("./views/Projects/Test/Test"));
const CheckVideo = React.lazy(() => import("./views/CheckVideo/CheckVideo"));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {path: "/", exact: true, name: " Check Video", component: CreateProfile},
  {path: "/createProfile", exact: true, name: "Check Video", component: CreateProfile},
  {path: "/editProfile/:id", exact: true, name: "Check Video", component: CreateProfile},
  {path: "/userList", exact: true, name: "UserList", component: UserList},
  {path: "/logtime", exact: true, name: "UserList", component: History},
  {path: "/logtimefail", exact: true, name: "UserList", component: HistoryFailed},
  // {path: "/history/:id", exact: true, name: "History", component: History},
  // {path: "/dashboard", name: "Dashboard", component: Dashboard},
  // {path: "/project/edit/:id", name: "Edit Detail", component: CreateProject},
  // {path: "/project/create", name: "Create Detail", component: CreateProject},
  {path: "/account", name: "View List", component: ViewProject},
  // {path: "/project/test", name: "View List", component: TestProject},
  {path: "/resetPassword", name: "Reset Password", component: ResetPassword},
  {path: "/department", name: "Department", component: Department},

];

export default routes;
