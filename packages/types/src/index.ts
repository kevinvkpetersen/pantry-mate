import { z } from 'zod';

export const newPantryItemSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string().nullable(),
    expiresOn: z.string().nullable(),
});
export type NewPantryItem = z.infer<typeof newPantryItemSchema>;

export const pantryItemSchema = z.object({
    ...newPantryItemSchema.shape,
    id: z.number(),
});
export type PantryItem = z.infer<typeof pantryItemSchema>;

export const newLocationSchema = z.object({
    name: z.string(),
});
export type NewLocation = z.infer<typeof newLocationSchema>;

export const locationSchema = z.object({
    ...newLocationSchema.shape,
    id: z.number(),
});
export type Location = z.infer<typeof locationSchema>;
