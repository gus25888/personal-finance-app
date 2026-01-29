import {
    CATEGORY_FILTER_ALL,
    CATEGORY_TYPE_FILTER,
    type CategoryFilter,
    type Movement,
    type CategoryTypeFilter,
} from "../../types";

// TODO: Remove this file
export const filterMovements = (
    movements: Movement[],
    movementType: CategoryTypeFilter,
    movementCategory: CategoryFilter,
    movementStartDate: string,
    movementEndDate: string,
) => {
    return (
        movements
            // type
            .filter((movement) =>
                movementType === CATEGORY_TYPE_FILTER.ALL
                    ? true
                    : movement.type === movementType,
            )
            // category
            .filter((movement) =>
                movementCategory === CATEGORY_FILTER_ALL
                    ? true
                    : movement.categoryId === movementCategory,
            )
            // start and end date
            .filter((movement) => {
                if (!movementStartDate && !movementEndDate) {
                    return true;
                } else if (movementStartDate && !movementEndDate) {
                    return movement.date >= movementStartDate;
                } else if (!movementStartDate && movementEndDate) {
                    return movement.date <= movementEndDate;
                } else {
                    return (
                        movement.date >= movementStartDate &&
                        movement.date <= movementEndDate
                    );
                }
            })
    );
};
