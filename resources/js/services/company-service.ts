import { CreateCompanyRequest, UserCompanyResponse } from '@/types/company';
import axios from 'axios';

export class CompanyService {
  static createCompany(request: CreateCompanyRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      /*
      *  router.post(
        route('companies.create'),
        { ...request },
        {
          onSuccess: () => {
            resolve();
          },
          onError: (errors) => {
            reject(new Error(Object.values(errors)[0] as string));
          },
          preserveState: false,
          preserveScroll: true,
          fresh: true,
        },
      );*/
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

    /*

    });
    */
  }

  static async getUserCompanies(): Promise<UserCompanyResponse> {
    try {
      const response = await axios.get(route('companies.list'));
      return response.data as UserCompanyResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Error al obtener las empresas del usuario.');
      }
      throw new Error('Ocurrió un error inesperado al obtener las empresas del usuario.');
    }
  }
}
