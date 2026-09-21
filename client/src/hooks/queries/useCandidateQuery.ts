import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateService } from "../../services";
import { queryKeys } from "../queryKeys";
import type {
  CandidateProfile,
  Experience,
  Education,
  UpdateCandidateProfilePayload,
} from "../../types";

// 1. Fetch Candidate Profile
export const useCandidateProfileQuery = () => {
  return useQuery<CandidateProfile>({
    queryKey: queryKeys.candidate.profile(),
    queryFn: async () => {
      const response = await candidateService.getProfile();
      const raw = response as unknown as {
        candidate?: CandidateProfile;
        data?: CandidateProfile;
      };
      return raw.candidate || raw.data || (response as unknown as CandidateProfile);
    },
  });
};

// 2. Update Basic Profile Details Mutation
export const useUpdateCandidateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCandidateProfilePayload) =>
      candidateService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.profile() });
    },
  });
};

// 3. Add Work Experience Mutation
export const useAddExperienceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experience: Experience) => candidateService.addExperience(experience),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.profile() });
    },
  });
};

// 4. Delete Work Experience Mutation
export const useDeleteExperienceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) =>
      candidateService.deleteExperience(experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.profile() });
    },
  });
};

// 5. Add Education Mutation
export const useAddEducationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (education: Education) => candidateService.addEducation(education),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.profile() });
    },
  });
};

// 6. Delete Education Mutation
export const useDeleteEducationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (educationId: string) =>
      candidateService.deleteEducation(educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.profile() });
    },
  });
};

// 7. Upload Resume Mutation
export const useUploadResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => candidateService.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidate.profile() });
    },
  });
};
