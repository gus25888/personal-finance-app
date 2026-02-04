import type { Movement } from "../../types";
import type { BackendEditMovement } from "./types";

export const mapEditMovementRequest = (
    movement: Partial<Movement>,
): BackendEditMovement => {
    const editData: BackendEditMovement = {};

    if (movement.date !== undefined) {
        editData.date = movement.date;
    }
    if (movement.description !== undefined) {
        editData.description = movement.description;
    }
    if (movement.amount !== undefined) {
        editData.amount = movement.amount;
    }
    if (movement.categoryId !== undefined) {
        editData.category = movement.categoryId;
    }

    return editData;
};
