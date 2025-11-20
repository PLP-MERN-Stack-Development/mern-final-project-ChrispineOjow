import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center ">
          <Spinner />
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
}

export default ProtectedRoute;

