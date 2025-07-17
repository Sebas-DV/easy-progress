import { create } from 'zustand';

type CompanyStoreState = {
  isOpen: boolean;
};

type CompanyStoreActions = {
  setIsOpen: (open: boolean) => void;
};

type CompanyStore = CompanyStoreActions & CompanyStoreState;

export const useCompanyStore = create<CompanyStore>((setState) => ({
  isOpen: false,
  setIsOpen: (open) =>
    setState({
      isOpen: open,
    }),
}));
