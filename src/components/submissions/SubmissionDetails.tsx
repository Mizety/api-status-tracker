import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/types/api";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
  RefreshCwIcon,
  Settings,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { StatusUpdateDialog } from "./StatusUpdateDialog";
import { retrySubmission } from "@/lib/api";
import { toast } from "sonner";

interface SubmissionDetailsProps {
  submission: Form;
  onRefresh: () => void;
}

export function SubmissionDetails({
  submission,
  onRefresh,
}: SubmissionDetailsProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retrySubmission(submission.id);
      toast.success("Submission retry initiated");
      onRefresh();
    } catch (error) {
      console.error("Failed to retry submission:", error);
      toast.error("Failed to retry submission");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/submissions")}
            className="mr-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Submission Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowStatusDialog(true)}
            className="transition-all"
          >
            <Settings className="h-4 w-4 mr-2" />
            Update Status
          </Button>
          {submission.status === "failed" && (
            <Button
              onClick={handleRetry}
              disabled={isRetrying}
              className="transition-all"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              {isRetrying ? "Retrying..." : "Retry Submission"}
            </Button>
          )}
        </div>
      </div>

      <Card className="shadow-md transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-md md:text-xl">
                Submission Overview
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Submitted by {submission.email}
              </CardDescription>
            </div>
            <StatusBadge
              status={submission.status}
              className="px-3 py-1 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium text-gray-500">ID</h3>
              <p className="font-mono text-sm">{submission.id}</p>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="flex items-center">
                <StatusBadge status={submission.status} />
                {submission.error && (
                  <div className="ml-2 flex items-center text-red-500 text-sm">
                    <AlertCircleIcon className="h-4 w-4 mr-1" />
                    Error detected
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <div className="flex items-center text-sm">
                <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>
                  {new Date(submission.createdAt).toLocaleString()} ({" "}
                  {formatDistanceToNow(new Date(submission.createdAt), {
                    addSuffix: true,
                  })}
                  )
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-medium text-gray-500">
                Last Updated
              </h3>
              <div className="flex items-center text-sm">
                <ClockIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>
                  {new Date(submission.updatedAt).toLocaleString()} ({" "}
                  {formatDistanceToNow(new Date(submission.updatedAt), {
                    addSuffix: true,
                  })}
                  )
                </span>
              </div>
            </div>
            {submission.retryAtempts !== null && (
              <div className="space-y-1.5">
                <h3 className="text-sm font-medium text-gray-500">
                  Retry Attempts
                </h3>
                <p>{submission.retryAtempts}</p>
              </div>
            )}
          </div>

          {submission.error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Message
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{submission.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Form Details</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Full Legal Name
                </h4>
                <p>{submission.fullLegalName}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{submission.email}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Country of Residence
                </h4>
                <p>{submission.countryOfResidence}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Company Name
                </h4>
                <p>{submission.CompanyName}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Company You Represent
                </h4>
                <p>{submission.CompanyYouRepresent}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Child Abuse Content
                </h4>
                <p>{submission.isChildAbuseContent ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Remove Child Abuse Content
                </h4>
                <p>{submission.removeChildAbuseContent ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Send Notice To Author
                </h4>
                <p>{submission.sendNoticeToAuthor ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Related To Media
                </h4>
                <p>{submission.isRelatedToMedia ? "Yes" : "No"}</p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Confirm Form
                </h4>
                <p>{submission.confirmForm ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-medium text-gray-500">
                Infringing URLs
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {submission.InfringingUrls.map((url, index) => (
                  <li key={index} className="text-sm break-all">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Question One
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {submission.QuestionOne}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Question Two
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {submission.QuestionTwo}
                </p>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-medium text-gray-500">
                  Question Three
                </h4>
                <p className="text-sm whitespace-pre-wrap">
                  {submission.QuestionThree}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-medium text-gray-500">Signature</h4>
              <p>{submission.signature}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate("/submissions")}>
            Back to Submissions
          </Button>
        </CardFooter>
      </Card>

      <StatusUpdateDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        submissionId={submission.id}
        currentStatus={submission.status}
        onSuccess={onRefresh}
      />
    </div>
  );
}
