import HomePage from "./pages/HomePage";
import Report from "../src/pages/ReportPage";
import Setting from "./pages/SettingPage";
import AddReport from "./pages/AddReportPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import {Routes, Route, useLocation} from "react-router-dom";
import Navbar from "../src/components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/sign-in' || location.pathname === '/sign-up';

  return (
    <>
      {!isAuthPage && <Navbar/>}
      <Routes>
        <Route path="/sign-in" element={
          <PublicRoute>
            <SignInPage/>
          </PublicRoute>
        } />
        <Route path="/sign-up/*" element={
          <PublicRoute>
            <SignUpPage/>
          </PublicRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage/>
          </ProtectedRoute>
        }/>
        <Route path="/reports" element={
          <ProtectedRoute>
            <Report/>
          </ProtectedRoute>
        }/>
        <Route path="/addReports" element={
          <ProtectedRoute>
            <AddReport/>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

export default App
