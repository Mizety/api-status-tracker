import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { SubmissionForm } from "@/components/submissions/SubmissionForm";
import { ArrowLeftIcon, LayoutDashboardIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

const NewSubmission = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="mr-2"
              >
                <LayoutDashboardIcon className="h-6 w-6 text-primary" />
                <h1 className="ml-2 text-sm md:text-xl font-semibold">
                  FS Dashboard
                </h1>
              </Button>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={() => navigate("/submissions")}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <SubmissionForm />
      </div>
    </div>
  );
};

export default NewSubmission;
