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

// 3. Candidate Apply for a Job Mutation with Optimistic UI Update
export const useApplyJobMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => applicationService.applyForJob(jobId),
    onMutate: async (jobId: string) => {
      // 1. Cancel any ongoing application queries so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.applications.mine() });

      // 2. Snapshot current state for error rollback
      const previousApplications = queryClient.getQueryData<Application[]>(
        queryKeys.applications.mine()
      );

      // 3. Instantly add optimistic application to cache
      queryClient.setQueryData<Application[]>(
        queryKeys.applications.mine(),
        (old = []) => {
          const alreadyExists = old.some(
            (app) => (typeof app.job === "object" ? app.job?._id : app.job) === jobId
          );
          if (alreadyExists) return old;

          const optimisticApplication: Application = {
            _id: `temp-${Date.now()}`,
            job: jobId,
            applicant: "",
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return [optimisticApplication, ...old];
        }
      );

      return { previousApplications };
    },
    onError: (_err, _jobId, context) => {
      // Rollback to previous state if API call fails
      if (context?.previousApplications) {
        queryClient.setQueryData(
          queryKeys.applications.mine(),
          context.previousApplications
        );
      }
    },
    onSettled: () => {
      // Background re-sync with server state
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
