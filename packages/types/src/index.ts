export type PantryItem = {
    id: number;
    name: string;
    quantity: number;
    unit: string | null;
    expiresOn: string | null; // 'YYYY-MM-DD'
};
