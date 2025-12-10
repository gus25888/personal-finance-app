import { useState, type JSX } from "react";

import {
    CATEGORY_FILTER_ALL,
    MOVEMENT_TYPE_FILTER,
    MOVEMENT_TYPE_LABEL,
    type CategoryFilter,
    type Movement,
    type MovementTypeFilter,
} from "../types";

import {
    filterMovements,
    calculateTotals,
    getCategoryName,
} from "../helpers/movements/";

import MovementListFilters from "./MovementListFilters";
import { categories } from "../data/categories";

type Props = {
    movements: Movement[];
    onRemoveMovement: (id: number) => void;
    onEditMovement: (movement: Movement) => void;
};

const MovementList = ({
    movements,
    onRemoveMovement,
    onEditMovement,
}: Props): JSX.Element => {
    const [movementType, setMovementType] = useState<MovementTypeFilter>(
        MOVEMENT_TYPE_FILTER.ALL
    );
    const [movementCategory, setMovementCategory] =
        useState<CategoryFilter>(CATEGORY_FILTER_ALL);

    const [movementStartDate, setMovementStartDate] = useState<string>("");
    const [movementEndDate, setMovementEndDate] = useState<string>("");

    const filteredMovements = filterMovements(
        movements,
        movementType,
        movementCategory,
        movementStartDate,
        movementEndDate
    );

    const { totalIncome, totalExpense, balance } =
        calculateTotals(filteredMovements);

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
                        <th className="table-header-cell">Eliminar</th>
                        <th className="table-header-cell">Editar</th>
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
                                <button
                                    className="delete-button"
                                    onClick={() => {
                                        if (confirm("¿Eliminar movimiento?")) {
                                            onRemoveMovement(movement.id);
                                        }
                                    }}
                                >
                                    X
                                </button>
                            </td>
                            <td className="table-cell table-cell-center">
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        onEditMovement(movement);
                                    }}
                                >
                                    X
                                </button>
                            </td>
                            <td className="table-cell table-cell-center">
                                {getCategoryName(
                                    categories,
                                    movement.categoryId
                                )}
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
