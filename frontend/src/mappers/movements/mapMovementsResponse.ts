import type { CategoryType } from "../../domain/movements/types";
import type { Movement } from "../../types";
import type { BackendMovement } from "./types";

export const mapMovementsResponse = (
    backendMovementData: BackendMovement[],
): Movement[] => {
    return backendMovementData.map((item) => ({
        id: item.id,
        date: item.date,
        description: item.description,
        amount: item.amount,
        categoryId: item.category.id,
        type: item.category.type as CategoryType,
    }));
};
