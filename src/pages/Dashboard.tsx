
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { getHealth, getSubmissions } from "@/lib/api";
import { PlusIcon, LayoutDashboardIcon, LogOutIcon, FileTextIcon, FileIcon, ServerIcon, CheckIcon, XIcon, RefreshCwIcon, AlertCircleIcon } from "lucide-react";
import { Form, HealthCheckResultDto } from "@/types/api";

const Dashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState<HealthCheckResultDto | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0,
    queued: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [healthData, submissionsData] = await Promise.all([
        getHealth(),
        getSubmissions({ page: 1, limit: 5 }),
      ]);

      setHealth(healthData);
      setRecentSubmissions(submissionsData.data);

      // Calculate counts
      const statusCounts = {
        total: submissionsData.meta.total,
        pending: 0,
        completed: 0,
        failed: 0,
        queued: 0,
      };

      submissionsData.data.forEach((submission) => {
        if (submission.status === "pending") statusCounts.pending++;
        if (submission.status === "completed") statusCounts.completed++;
        if (submission.status === "failed") statusCounts.failed++;
        if (submission.status === "queued" || submission.status === "requeued") statusCounts.queued++;
      });

      setCounts(statusCounts);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const memoryStat = health?.checks.memory
    ? `${Math.round(health.checks.memory.used / 1024 / 1024)} MB / ${Math.round(
        health.checks.memory.total / 1024 / 1024
      )} MB`
    : "Unknown";

  const uptimeStat = health?.checks.uptime
    ? formatDistanceToNow(new Date(Date.now() - health.checks.uptime * 1000), {
        addSuffix: false,
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboardIcon className="h-6 w-6 text-primary" />
              <h1 className="ml-2 text-xl font-semibold">Form Submission Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleLogout} className="flex items-center">
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-500">View and manage your form submissions</p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/new-submission" className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Submission
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/submissions" className="flex items-center">
                <FileTextIcon className="h-4 w-4 mr-2" />
                All Submissions
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <FileIcon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : counts.total}</div>
              <p className="text-xs text-gray-500 mt-1">All form submissions</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <RefreshCwIcon className="h-4 w-4 text-status-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : counts.pending}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting processing</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckIcon className="h-4 w-4 text-status-completed" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : counts.completed}</div>
              <p className="text-xs text-gray-500 mt-1">Successfully processed</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XIcon className="h-4 w-4 text-status-failed" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : counts.failed}</div>
              <p className="text-xs text-gray-500 mt-1">Require attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>The 5 most recent form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : recentSubmissions.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <FileIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2">No submissions yet</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link to="/new-submission">Create your first submission</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSubmissions.map((submission) => (
                    <Link
                      key={submission.id}
                      to={`/submission/${submission.id}`}
                      className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium truncate max-w-[200px]">
                            {submission.fullLegalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            submission.status === "completed"
                              ? "bg-status-completed/10 text-status-completed"
                              : submission.status === "failed"
                              ? "bg-status-failed/10 text-status-failed"
                              : submission.status === "pending"
                              ? "bg-status-pending/10 text-status-pending"
                              : "bg-status-queued/10 text-status-queued"
                          }`}
                        >
                          {submission.status}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link to="/submissions">View all submissions</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>API health information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : health ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <div className="flex items-center">
                      {health.status === 200 ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-status-completed mr-2"></div>
                          <span className="text-sm text-status-completed">Online</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-status-failed mr-2"></div>
                          <span className="text-sm text-status-failed">Issues</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Uptime</span>
                    <span className="text-sm">{uptimeStat}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Memory</span>
                    <span className="text-sm">{memoryStat}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Check</span>
                    <span className="text-sm">
                      {health.checks.timestamp
                        ? new Date(health.checks.timestamp).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={fetchDashboardData}
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <AlertCircleIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2">Could not fetch system status</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={fetchDashboardData}
                  >
                    <RefreshCwIcon className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
