import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruiterService, jobService } from "../../services";
import { queryKeys } from "../queryKeys";
import type { Job, RecruiterProfile, RecruiterDashboardStats } from "../../types";

// 1. Fetch Recruiter's Posted Jobs
export const useRecruiterJobsQuery = () => {
  return useQuery<Job[]>({
    queryKey: queryKeys.recruiter.jobs(),
    queryFn: () => jobService.getMyPostedJobs(),
  });
};

// 2. Fetch Recruiter Dashboard Stats
export const useRecruiterStatsQuery = () => {
  return useQuery<RecruiterDashboardStats>({
    queryKey: queryKeys.recruiter.stats(),
    queryFn: async () => {
      const response = await recruiterService.getDashboardStats();
      const raw = response as unknown as {
        stats?: RecruiterDashboardStats;
        data?: RecruiterDashboardStats;
      };
      return raw.stats || raw.data || (response as unknown as RecruiterDashboardStats);
    },
  });
};

// 3. Fetch Recruiter Profile
export const useRecruiterProfileQuery = () => {
  return useQuery<RecruiterProfile>({
    queryKey: queryKeys.recruiter.profile(),
    queryFn: async () => {
      const response = await recruiterService.getProfile();
      const raw = response as unknown as {
        profile?: RecruiterProfile;
        data?: RecruiterProfile;
      };
      return raw.profile || raw.data || (response as unknown as RecruiterProfile);
    },
  });
};

// 4. Update Recruiter Profile Mutation
export const useUpdateRecruiterProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<RecruiterProfile>) =>
      recruiterService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.profile() });
    },
  });
};

// 5. Upload Company Logo Mutation
export const useUploadCompanyLogoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => recruiterService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruiter.jobs() });
    },
  });
};
