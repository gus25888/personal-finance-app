import { MOVEMENT_TYPE_FILTER, type Movement } from "../../types";

export const calculateTotals = (movements: Movement[]) => {
    let totalIncome = 0,
        totalExpense = 0;

    movements.forEach((movement) => {
        if (movement.type === MOVEMENT_TYPE_FILTER.INCOME) {
            totalIncome += movement.amount;
        } else {
            totalExpense += movement.amount;
        }
    });

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
};
