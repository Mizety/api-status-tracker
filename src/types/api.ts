export type FormStatus =
  | "pending"
  | "completed"
  | "failed"
  | "retry"
  | "queued"
  | "requeued";

export interface HealthCheckResultDto {
  error: Record<string, any>;
  status: number;
  checks: {
    status: string;
    timestamp: string;
    uptime: number;
    memory: {
      total: number;
      used: number;
    };
    cpu: Record<string, any>;
  };
}

export interface CreateFormDto {
  fullLegalName: string;
  isChildAbuseContent: boolean;
  removeChildAbuseContent: boolean;
  countryOfResidence: string;
  CompanyName: string;
  CompanyYouRepresent: string;
  email: string;
  sendNoticeToAuthor: boolean;
  InfringingUrls: string[];
  isRelatedToMedia: boolean;
  QuestionOne: string;
  QuestionTwo: string;
  QuestionThree: string;
  confirmForm: boolean;
  signature: string;
}

export interface Form extends CreateFormDto {
  id: string;
  status: FormStatus | null;
  error: string | null;
  retryAtempts: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  limit: number;
}

export interface GetFormsResponse {
  data: Form[];
  meta: PaginationMeta;
  message: string;
}

export interface UpdateFormStatusDto {
  status: FormStatus;
  error?: string;
}

export interface SubmissionParams {
  page: number;
  limit: number;
  search?: string;
}
