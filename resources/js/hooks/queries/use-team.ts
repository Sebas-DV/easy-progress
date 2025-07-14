import { TeamService } from '@/services/team-service';
import { CreateTeamRequest, SwitchTeamRequest, UpdateTeamRequest } from '@/types/team';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSwitchTeam = () => {
    return useMutation({
        mutationFn: (request: SwitchTeamRequest) => TeamService.switchTeam(request),
        onSuccess: () => {
            toast.success('Team switched successfully.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while switching teams.');
        },
    });
};

export const useCreateTeam = () => {
    return useMutation({
        mutationFn: (request: CreateTeamRequest) => TeamService.createTeam(request),
        onSuccess: () => {
            toast.success('Team created successfully.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while creating the team.');
        },
    });
};

export const useUpdateTeam = () => {
    return useMutation({
        mutationFn: (request: UpdateTeamRequest) => TeamService.updateTeam(request),
        onSuccess: () => {
            toast.success('Team updated successfully.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while updating the team.');
        },
    });
};

export const useDeleteTeam = () => {
    return useMutation({
        mutationFn: (teamId: string) => TeamService.deleteTeam(teamId),
        onSuccess: () => {
            toast.success('Team deleted successfully.');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'An error occurred while deleting the team.');
        },
    });
};
