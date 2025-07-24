import { CompanyService } from '@/services/company-service';
import { CreateCompanyRequest } from '@/types/company';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

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
