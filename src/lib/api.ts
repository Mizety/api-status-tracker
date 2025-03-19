import {
  CreateFormDto,
  Form,
  FormStatus,
  GetFormsResponse,
  SubmissionParams,
  UpdateFormStatusDto,
} from "@/types/api";

const API_URL = localStorage.getItem("apiUrl") || "";
const API_KEY = localStorage.getItem("apiKey") || "";

const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch health status");
  }

  return await response.json();
}

export async function getSubmissions({
  page,
  limit,
  search,
}: SubmissionParams): Promise<GetFormsResponse> {
  let url = `${API_URL}/submissions?page=${page}&limit=${limit}`;
  console.log(search);
  if (search) {
    url += `&search=${search}`;
  }
  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  return await response.json();
}

type SubmissionStats = {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  queued: number;
  requeued: number;
};
export async function submissionStats(): Promise<SubmissionStats> {
  const response = await fetch(`${API_URL}/submissions/stats`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submission stats");
  }

  return await response.json();
}

export async function getSubmission(id: string): Promise<Form> {
  const response = await fetch(`${API_URL}/submission/${id}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch submission with ID: ${id}`);
  }

  return await response.json();
}

export async function getSubmissionStatus(
  id: string
): Promise<{ status: FormStatus }> {
  const response = await fetch(`${API_URL}/submission/${id}/status`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch status for submission with ID: ${id}`);
  }

  return await response.json();
}

export async function updateSubmissionStatus(
  id: string,
  data: UpdateFormStatusDto
): Promise<Form> {
  const response = await fetch(`${API_URL}/submission/${id}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update status for submission with ID: ${id}`);
  }

  return await response.json();
}

export async function retrySubmission(id: string): Promise<Form> {
  const response = await fetch(`${API_URL}/submission/${id}/retry`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to retry submission with ID: ${id}`);
  }

  return await response.json();
}

export async function createSubmission(data: CreateFormDto): Promise<Form> {
  const response = await fetch(`${API_URL}/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create submission");
  }

  return await response.json();
}
