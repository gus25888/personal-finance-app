import { CATEGORY_TYPE_FILTER } from "../../types";
import type { Movement } from "../../domain/movements/types";

export const calculateTotals = (movements: Movement[]) => {
    let totalIncome = 0,
        totalExpense = 0;

    movements.forEach((movement) => {
        if (movement.categoryType === CATEGORY_TYPE_FILTER.INCOME) {
            totalIncome += movement.amount;
        } else {
            totalExpense += movement.amount;
        }
    });

    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
};
