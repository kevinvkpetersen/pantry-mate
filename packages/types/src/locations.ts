import z from 'zod';

export const newLocationSchema = z.object({
    name: z.string(),
});
export type NewLocation = z.infer<typeof newLocationSchema>;

export const locationSchema = z.object({
    ...newLocationSchema.shape,
    id: z.number(),
});
export type Location = z.infer<typeof locationSchema>;
