
import { CreateFormDto, Form, FormStatus, GetFormsResponse, SubmissionParams, UpdateFormStatusDto } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY || "";

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

export async function getSubmissions({ page, limit }: SubmissionParams): Promise<GetFormsResponse> {
  const response = await fetch(`${API_URL}/submissions?page=${page}&limit=${limit}`, {
    method: "GET",
    headers,
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
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

export async function getSubmissionStatus(id: string): Promise<{ status: FormStatus }> {
  const response = await fetch(`${API_URL}/submission/${id}/status`, {
    method: "GET",
    headers,
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch status for submission with ID: ${id}`);
  }
  
  return await response.json();
}

export async function updateSubmissionStatus(id: string, data: UpdateFormStatusDto): Promise<Form> {
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
