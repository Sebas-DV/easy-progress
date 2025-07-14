import { CreateTeamRequest, SwitchTeamRequest, UpdateTeamRequest } from '@/types/team';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export class TeamService {
    static async switchTeam(request: SwitchTeamRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            router.post(
                route('teams.switch'),
                { ...request },
                {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (errors) => {
                        reject(new Error(Object.values(errors)[0] as string));
                    },
                    preserveScroll: true,
                },
            );
        });
    }

    static async createTeam(request: CreateTeamRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            router.post(
                route('teams.add'),
                { ...request },
                {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (errors) => {
                        reject(new Error(Object.values(errors)[0] as string));
                    },
                    preserveScroll: true,
                },
            );
        });
    }

    static async updateTeam(request: UpdateTeamRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            router.post(
                route('teams.update'),
                { ...request },
                {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (errors) => {
                        reject(new Error(Object.values(errors)[0] as string));
                    },
                    preserveScroll: true,
                    forceFormData: true,
                },
            );
        });
    }

    static async deleteTeam(team: string): Promise<void> {
        return new Promise((resolve, reject) => {
            router.delete(route('teams.delete', { team }), {
                onSuccess: () => {
                    resolve();
                },
                onError: (errors) => {
                    reject(new Error(Object.values(errors)[0] as string));
                },
            });
        });
    }
}
