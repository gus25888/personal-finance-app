export const MOVEMENT_TYPE = {
    INCOME: "income",
    EXPENSE: "expense",
} as const;

export const MOVEMENT_TYPE_FILTER = {
    ...MOVEMENT_TYPE,
    ALL: "all",
} as const;
export const MOVEMENT_TYPE_LABEL = {
    INCOME: "Income",
    EXPENSE: "Expense",
} as const;

export const MOVEMENT_TYPE_FILTER_LABEL = {
    ...MOVEMENT_TYPE_LABEL,
    ALL: "All",
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
export type Category = {
    id: number;
    name: string;
};
export type NewMovement = Omit<Movement, "id">;
