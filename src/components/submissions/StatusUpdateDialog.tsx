
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormStatus, UpdateFormStatusDto } from "@/types/api";
import { updateSubmissionStatus } from "@/lib/api";
import { toast } from "sonner";

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
  currentStatus: FormStatus | null;
  onSuccess: () => void;
}

export function StatusUpdateDialog({
  open,
  onOpenChange,
  submissionId,
  currentStatus,
  onSuccess,
}: StatusUpdateDialogProps) {
  const [status, setStatus] = useState<FormStatus | "">("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setStatus("");
    setError("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdateFormStatusDto = {
        status: status as FormStatus,
      };

      if (error.trim()) {
        updateData.error = error;
      }

      await updateSubmissionStatus(submissionId, updateData);
      toast.success("Status updated successfully");
      onSuccess();
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Submission Status</DialogTitle>
          <DialogDescription>
            Current status: <span className="font-medium">{currentStatus || "None"}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">New Status</Label>
            <Select 
              value={status} 
              onValueChange={(value: string) => setStatus(value as FormStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="retry">Retry</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="requeued">Requeued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="error">Error Message (Optional)</Label>
            <Textarea
              id="error"
              value={error}
              onChange={(e) => setError(e.target.value)}
              placeholder="Enter error message if applicable"
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter className="flex space-x-2 sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!status || isSubmitting}
            className="ml-2"
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
