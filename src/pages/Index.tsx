
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Form Submission Dashboard</h1>
          <p className="text-gray-500 max-w-sm mx-auto">
            Sign in to access the dashboard and manage your form submissions.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
