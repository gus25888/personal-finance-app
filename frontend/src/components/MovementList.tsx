import { useState, type JSX } from "react";

import {
    CATEGORY_FILTER_ALL,
    MOVEMENT_TYPE_FILTER,
    MOVEMENT_TYPE_LABEL,
    type CategoryFilter,
    type Movement,
    type MovementTypeFilter,
} from "../types";
import { categories } from "../data/categories";
import MovementListFilters from "./MovementListFilters";

type Props = {
    movements: Movement[];
};

const MovementList = ({ movements }: Props): JSX.Element => {
    const [movementType, setMovementType] = useState<MovementTypeFilter>(
        MOVEMENT_TYPE_FILTER.ALL
    );
    const [movementCategory, setMovementCategory] =
        useState<CategoryFilter>(CATEGORY_FILTER_ALL);

    const [movementStartDate, setMovementStartDate] = useState<string>("");
    const [movementEndDate, setMovementEndDate] = useState<string>("");

    const filteredMovements = movements
        // type
        .filter((movement) =>
            movementType === MOVEMENT_TYPE_FILTER.ALL
                ? true
                : movement.type === movementType
        )
        // category
        .filter((movement) =>
            movementCategory === CATEGORY_FILTER_ALL
                ? true
                : movement.categoryId === movementCategory
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
        });

    let totalIncome = 0,
        totalExpense = 0;

    filteredMovements.forEach((movement) => {
        if (movement.type === MOVEMENT_TYPE_FILTER.INCOME) {
            totalIncome += movement.amount;
        } else {
            totalExpense += movement.amount;
        }
    });

    const balance = totalIncome - totalExpense;

    return (
        <section className="table-section">
            <p className="table-title">Movements List</p>
            <MovementListFilters
                movementType={movementType}
                setMovementType={setMovementType}
                movementCategory={movementCategory}
                setMovementCategory={setMovementCategory}
                movementStartDate={movementStartDate}
                setMovementStartDate={setMovementStartDate}
                movementEndDate={movementEndDate}
                setMovementEndDate={setMovementEndDate}
            />
            <p className="movement-totals-container">
                <span className="movement-total-item">{`Income: $ ${totalIncome}`}</span>
                <span className="movement-total-item">{`Expenses: $ ${totalExpense}`}</span>
                <span className="movement-total-item">{`Balance: $ ${balance}`}</span>
            </p>
            <table className="movements-table">
                <thead className="table-header">
                    <tr>
                        <th className="table-header-cell">Categoría</th>
                        <th className="table-header-cell">Tipo</th>
                        <th className="table-header-cell">Fecha</th>
                        <th className="table-header-cell">Descripción</th>
                        <th className="table-header-cell">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMovements.map((movement) => (
                        <tr key={movement.id} className="table-row">
                            <td className="table-cell table-cell-center">
                                {categories.find(
                                    (c) => c.id === movement.categoryId
                                )?.name || "N/A"}
                            </td>
                            <td className="table-cell table-cell-center">
                                {MOVEMENT_TYPE_LABEL[movement.type]}
                            </td>
                            <td className="table-cell table-cell-center">
                                {movement.date}
                            </td>
                            <td className="table-cell">
                                {movement.description}
                            </td>
                            <td className="table-cell table-cell-right">
                                {movement.amount}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default MovementList;
