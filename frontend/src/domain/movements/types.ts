// TODO: Apenas se implemente el domain de Categories las definiciones de Categories se deben ajustar estas definiciones para que provengan desde allá.

export const CATEGORY_TYPE = {
    INCOME: "income",
    EXPENSE: "expense",
} as const;

export type CategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

export type Movement = {
    id: number;
    date: string;
    description: string;
    amount: number;
    categoryId: number;
    type: CategoryType;
};

export type MovementFilter = {
    startDate?: string;
    endDate?: string;
    categoryID?: number;
    categoryType?: CategoryType;
    description?: string;
};
