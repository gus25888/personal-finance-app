export type BackendMovement = {
    id: number;
    description: string;
    date: string;
    amount: number;
    category: {
        id: number;
        name: string;
        type: string;
        deletedAt: string | null;
    };
    createdAt: string;
    updatedAt: string | null;
};
