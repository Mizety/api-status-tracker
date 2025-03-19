
import { FormStatus } from "@/types/api";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: FormStatus | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: FormStatus | null) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          color: "bg-status-pending/10 text-status-pending border border-status-pending/30",
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-status-completed/10 text-status-completed border border-status-completed/30",
        };
      case "failed":
        return {
          label: "Failed",
          color: "bg-status-failed/10 text-status-failed border border-status-failed/30",
        };
      case "retry":
        return {
          label: "Retry",
          color: "bg-status-retry/10 text-status-retry border border-status-retry/30",
        };
      case "queued":
        return {
          label: "Queued",
          color: "bg-status-queued/10 text-status-queued border border-status-queued/30",
        };
      case "requeued":
        return {
          label: "Requeued",
          color: "bg-status-requeued/10 text-status-requeued border border-status-requeued/30",
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border border-gray-300",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        "status-badge transition-all font-medium",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
