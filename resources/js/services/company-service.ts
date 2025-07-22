import { CreateCompanyRequest } from '@/types/company';
import axios from 'axios';

export class CompanyService {
  static createCompany(request: CreateCompanyRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      axios
        .post(route('companies.create'), request)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors;
            reject(new Error(Object.values(errors)[0] as string));
          } else {
            reject(new Error('Ocurrió un error inesperado.'));
          }
        });
    });
  }
}
