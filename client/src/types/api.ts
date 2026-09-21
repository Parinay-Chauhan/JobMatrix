export interface ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginationMeta {
  totalJobs?: number;
  total?: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  jobs?: T[];
  items?: T[];
  pagination: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode?: number;
  message: string;
  success: boolean;
  errors?: unknown[];
}
