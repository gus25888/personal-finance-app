/** MOVEMENT CONSTANTS AND TYPES */
export const MOVEMENT_TYPE = {
    INCOME: "income",
    EXPENSE: "expense",
} as const;

export const MOVEMENT_TYPE_FILTER = {
    ...MOVEMENT_TYPE,
    ALL: "all",
} as const;

export const MOVEMENT_TYPE_LABEL = {
    income: "Income",
    expense: "Expense",
} as const;

export const MOVEMENT_TYPE_FILTER_LABEL = {
    ...MOVEMENT_TYPE_LABEL,
    all: "All",
} as const;

export type MovementType = (typeof MOVEMENT_TYPE)[keyof typeof MOVEMENT_TYPE];

export type MovementTypeFilter =
    (typeof MOVEMENT_TYPE_FILTER)[keyof typeof MOVEMENT_TYPE_FILTER];

export type Movement = {
    id: number;
    date: string;
    description: string;
    amount: number;
    categoryId: Category["id"];
    type: MovementType;
};

export type NewMovement = Omit<Movement, "id">;

/** CATEGORY CONSTANTS AND TYPES */

export type Category = {
    id: number;
    name: string;
};

export type CategoryFilter = Category["id"] | typeof CATEGORY_FILTER_ALL;

export const CATEGORY_FILTER_ALL = "all" as const;
export const CATEGORY_FILTER_ALL_LABEL = "All Categories" as const;
