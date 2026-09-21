import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "../../services";
import { queryKeys } from "../queryKeys";
import type { Application, ApplicationStatus } from "../../types";

// 1. Fetch Candidate's own submitted applications
export const useMyApplicationsQuery = () => {
  return useQuery<Application[]>({
    queryKey: queryKeys.applications.mine(),
    queryFn: () => applicationService.getMyApplications(),
  });
};

// 2. Fetch Applicants for a specific job (Recruiter)
export const useJobApplicantsQuery = (jobId: string) => {
  return useQuery<Application[]>({
    queryKey: queryKeys.applications.jobApplicants(jobId),
    queryFn: () => applicationService.getJobApplicants(jobId),
    enabled: Boolean(jobId),
  });
};

// 3. Candidate Apply for a Job Mutation
export const useApplyJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => applicationService.applyForJob(jobId),
    onSuccess: () => {
      // Invalidate candidate's application list and jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.mine() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
  });
};

// 4. Recruiter Update Application Status Mutation
export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationStatus;
      jobId?: string;
    }) => applicationService.updateApplicationStatus(applicationId, status),
    onSuccess: (_, variables) => {
      // Invalidate specific job applicants list and overall applications
      if (variables.jobId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.applications.jobApplicants(variables.jobId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.stats() });
    },
  });
};
