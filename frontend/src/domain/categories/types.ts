export const CATEGORY_TYPE = {
    INCOME: "income",
    EXPENSE: "expense",
} as const;

export type CategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

export type Category = {
    id: number;
    name: string;
    type: CategoryType;
};
