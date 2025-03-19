import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { getSubmission } from "@/lib/api";
import { SubmissionDetails } from "@/components/submissions/SubmissionDetails";
import { toast } from "sonner";
import { Form } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";

const SubmissionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (id) {
      fetchSubmission(id);
    }
  }, [id, isAuthenticated, navigate]);

  const fetchSubmission = async (submissionId: string) => {
    setIsLoading(true);
    try {
      const data = await getSubmission(submissionId);
      setSubmission(data);
    } catch (error) {
      console.error("Failed to fetch submission:", error);
      if (error instanceof Error && error.message === "404") {
        toast.error("Submission not found");
      } else {
        toast.error("Failed to load submission details");
      }
      navigate("/submissions");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-[250px]" />
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Submission Not Found</h1>
          <p className="text-gray-500 mt-2">
            The submission you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/submissions")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <SubmissionDetails
          submission={submission}
          onRefresh={() => fetchSubmission(id!)}
        />
      </div>
    </div>
  );
};

export default SubmissionDetail;
