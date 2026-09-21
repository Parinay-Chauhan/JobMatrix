import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobService } from "../../services";
import { queryKeys } from "../queryKeys";
import type { Job, CreateJobPayload, JobFilterParams } from "../../types";

// 1. Fetch public jobs with filters
export const useJobsQuery = (params?: JobFilterParams) => {
  return useQuery<Job[]>({
    queryKey: queryKeys.jobs.list(params),
    queryFn: () => jobService.getAllJobs(params),
  });
};

// 2. Fetch single job details
export const useJobDetailQuery = (id: string) => {
  return useQuery<Job>({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobService.getJobById(id),
    enabled: Boolean(id),
  });
};

// 3. Post a new job mutation (Recruiter)
export const usePostJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => jobService.postJob(payload),
    onSuccess: () => {
      // Invalidate public jobs and recruiter's job list
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.jobs() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.stats() });
    },
  });
};

// 4. Update existing job mutation (Recruiter)
export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateJobPayload> }) =>
      jobService.updateJob(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.jobs() });
    },
  });
};

// 5. Toggle job active status (Recruiter)
export const useToggleJobStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.toggleJobStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.jobs() });
    },
  });
};

// 6. Delete job mutation (Recruiter)
export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.jobs() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.stats() });
    },
  });
};
