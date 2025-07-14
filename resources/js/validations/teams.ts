import { z } from 'zod';

const teamSchema = z.object({
    name: z.string().min(1, 'Team name is required'),
    description: z.string().optional(),
});
