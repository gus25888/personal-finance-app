import type { CategoryType } from "../../domain/movements/types";
import type { Movement } from "../../types";
import type { BackendMovement } from "./types";

export const mapMovementsResponse = (
    backendMovementData: BackendMovement,
): Movement => ({
    id: backendMovementData.id,
    date: backendMovementData.date.includes("T")
        ? backendMovementData.date.split("T")[0]
        : backendMovementData.date,
    description: backendMovementData.description,
    amount: backendMovementData.amount,
    categoryId: backendMovementData.category.id,
    type: backendMovementData.category.type as CategoryType,
});
