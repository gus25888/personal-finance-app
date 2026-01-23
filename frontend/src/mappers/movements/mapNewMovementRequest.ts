import type { NewMovement } from "../../types";
import type { BackendNewMovement } from "./types";

export const mapNewMovementRequest = (
    newMovement: NewMovement,
): BackendNewMovement => ({
    date: newMovement.date,
    description: newMovement.description,
    amount: newMovement.amount,
    category: newMovement.categoryId,
});
