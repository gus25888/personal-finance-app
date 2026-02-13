import {
    CATEGORY_TYPE,
    type Category,
    type CategoryType,
} from "../domain/categories/types";

/** CATEGORY CONSTANTS AND TYPES */
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

export type CategoryTypeFilter =
    (typeof CATEGORY_TYPE_FILTER)[keyof typeof CATEGORY_TYPE_FILTER];

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
