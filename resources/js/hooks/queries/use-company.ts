import { CompanyService } from '@/services/company-service';
import { CreateCompanyRequest } from '@/types/company';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export const companyKeys = {
  all: ['companies'] as const,
  userCompanies: () => [...companyKeys.all, 'userCompanies'] as const,
  currentCompany: () => [...companyKeys.all, 'currentCompany'] as const,
};

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: (request: CreateCompanyRequest) => CompanyService.createCompany(request),
    onSuccess: () => {
      toast.success('Company created successfully.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An error occurred while creating the company.');
    },
  });
};

export const useUserCompanies = () => {
  return useQuery({
    queryKey: companyKeys.userCompanies(),
    queryFn: CompanyService.getUserCompanies,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });
};
