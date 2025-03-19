import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui-custom/DataTable";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { getSubmissions } from "@/lib/api";
import { Form, SubmissionParams } from "@/types/api";
import {
  ArrowLeftIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Submissions = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      fetchSubmissions({ page: 1, limit: limit, search: searchTerm });
    }
  }, [isAuthenticated, navigate, limit, searchTerm]);

  const fetchSubmissions = async (params: SubmissionParams) => {
    setIsLoading(true);
    try {
      const response = await getSubmissions(params);
      console.log(response);
      setSubmissions(response.data);
      setPagination({
        currentPage: response.meta.currentPage,
        totalPages: response.meta.totalPages,
        total: response.meta.total,
      });
      setLimit(response.meta.limit);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchSubmissions({ page, limit: limit });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd implement search on the server side
    // For now, we'll just refresh the data
    fetchSubmissions({ page: 1, limit: limit, search: searchTerm });
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (submission: Form) => (
        <div>
          <div className="font-medium">{submission.fullLegalName}</div>
          <div className="text-sm text-gray-500">{submission.email}</div>
        </div>
      ),
    },
    {
      id: "company",
      header: "Company",
      cell: (submission: Form) => submission.CompanyName,
    },
    {
      id: "status",
      header: "Status",
      cell: (submission: Form) => <StatusBadge status={submission.status} />,
    },
    {
      id: "date",
      header: "Submitted",
      cell: (submission: Form) => (
        <div className="text-sm">
          <div>{new Date(submission.createdAt).toLocaleDateString()}</div>
          <div className="text-gray-500">
            {formatDistanceToNow(new Date(submission.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center ">
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
              <Button asChild variant="default" className="ml-4">
                <Link
                  to="/new-submission"
                  className="flex items-center text-sm md:text-base"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {window.innerWidth < 768 ? "New" : "New Submission"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-md md:text-2xl font-bold mb-2">
            All Submissions
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Showing {submissions.length} of {pagination.total} total submissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-sm items-center space-x-2"
          >
            <Input
              type="search"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <SearchIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                fetchSubmissions({
                  page: pagination.currentPage,
                  limit: limit,
                })
              }
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(parseInt(value));
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select a limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          data={submissions}
          columns={columns}
          onRowClick={(submission) => navigate(`/submission/${submission.id}`)}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Submissions;
