import z from 'zod';

export const newItemSchema = z.object({
    name: z.string(),
    locationId: z.number(),
    quantity: z.number(),
    unit: z.string().nullable(),
    expiresOn: z.iso.date().nullable(),
});
export type NewItem = z.infer<typeof newItemSchema>;

export const itemSchema = z.object({
    ...newItemSchema.shape,
    id: z.number(),
});
export type Item = z.infer<typeof itemSchema>;
