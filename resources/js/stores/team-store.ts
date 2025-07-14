import { create } from 'zustand';

type TeamStoreState = {
    isOpen: boolean;
};

type TeamStoreActions = {
    setIsOpen: (open: boolean) => void;
};

type TeamStore = TeamStoreActions & TeamStoreState;

export const useTeamStore = create<TeamStore>((setState) => ({
    isOpen: false,
    setIsOpen: (open) =>
        setState({
            isOpen: open,
        }),
}));
