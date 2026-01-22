/** CATEGORY CONSTANTS AND TYPES */
export const CATEGORY_TYPE = {
    INCOME: "income",
    EXPENSE: "expense",
} as const;

export const CATEGORY_TYPE_FILTER = {
    ...CATEGORY_TYPE,
    ALL: "all",
} as const;

export const CATEGORY_TYPE_LABEL = {
    income: "Income",
    expense: "Expense",
} as const;

export const CATEGORY_TYPE_FILTER_LABEL = {
    ...CATEGORY_TYPE_LABEL,
    all: "All",
} as const;

export type CategoryType = (typeof CATEGORY_TYPE)[keyof typeof CATEGORY_TYPE];

export type CategoryTypeFilter =
    (typeof CATEGORY_TYPE_FILTER)[keyof typeof CATEGORY_TYPE_FILTER];

export type Category = {
    id: number;
    name: string;
};

export type CategoryFilter = Category["id"] | typeof CATEGORY_FILTER_ALL;

export const CATEGORY_FILTER_ALL = "all" as const;
export const CATEGORY_FILTER_ALL_LABEL = "All Categories" as const;

/** MOVEMENT CONSTANTS AND TYPES */
export type Movement = {
    id: number;
    date: string;
    description: string;
    amount: number;
    categoryId: Category["id"];
    type: CategoryType;
};

export type NewMovement = Omit<Movement, "id">;
