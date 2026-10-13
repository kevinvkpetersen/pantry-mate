export type NewPantryItem = {
    name: string;
    quantity: number;
    unit: string | null;
    expiresOn: string | null; // 'YYYY-MM-DD'
};

export type PantryItem = NewPantryItem & {
    id: number;
};
