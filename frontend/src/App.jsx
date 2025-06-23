import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProblemLayout from "./layouts/ProblemLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Students/Dashboard";
import { ProblemView } from "./pages";
// import Leaderboard from "./pages/Leaderboard";
// import Groups from "./pages/Groups";
// import Practice from "./pages/Practice";
import { StudentLogin } from "./pages";
import { StudentRegister } from "./pages";
// import InstructorLogin from "./pages/auth/InstructorLogin";
// import InstructorRegister from "./pages/auth/InstructorRegister";
import { InstructorDashboard } from "./pages";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        {/* <Route path="/instructor/login" element={<InstructorLogin />} />
        <Route path="/instructor/register" element={<InstructorRegister />} /> */}
      </Route>

      {/* Protected Routes for Students */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/practice" element={<Practice />} /> */}
        </Route>

        {/* Fullscreen Problem Editor */}
        <Route element={<ProblemLayout />}>
          <Route path="/problem/:id" element={<ProblemView />} />
        </Route>
      </Route>

      {/* Protected Routes for Instructors */}
      <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
        <Route element={<MainLayout />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          {/* <Route path="/instructor/groups" element={<Groups />} /> */}
        </Route>
      </Route>
    </>
  )
);


function App() {

  return <RouterProvider router={router} />;
}

export default App
