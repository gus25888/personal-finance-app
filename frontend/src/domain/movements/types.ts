import type { Category, CategoryType } from "../categories/types";

export type Movement = {
    id: number;
    date: string;
    description: string;
    amount: number;
    categoryId: Category["id"];
    categoryName: Category["name"];
    categoryType: CategoryType;
};

export type NewMovement = Omit<
    Movement,
    "id" | "categoryName" | "categoryType"
>;

export type MovementFilter = {
    startDate?: string;
    endDate?: string;
    categoryID?: number;
    categoryType?: CategoryType;
    description?: string;
};
