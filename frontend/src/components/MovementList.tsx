import { useState, type JSX } from "react";

import {
    CATEGORY_FILTER_ALL,
    MOVEMENT_TYPE_FILTER,
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

    return (
        <section className="table-section">
            <p className="table-title">Movements List</p>
            <MovementListFilters
                movementType={movementType}
                setMovementType={setMovementType}
                movementCategory={movementCategory}
                setMovementCategory={setMovementCategory}
            />
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
                    {movements
                        .filter((movement) =>
                            movementType === MOVEMENT_TYPE_FILTER.ALL
                                ? true
                                : movement.type === movementType
                        )
                        .filter((movement) =>
                            movementCategory === CATEGORY_FILTER_ALL
                                ? true
                                : movement.categoryId === movementCategory
                        )
                        .map((movement) => {
                            const categoryName =
                                categories.find(
                                    (c) => c.id === movement.categoryId
                                )?.name || "N/A";
                            return (
                                <tr key={movement.id} className="table-row">
                                    <td className="table-cell table-cell-center">
                                        {categoryName}
                                    </td>
                                    <td className="table-cell table-cell-center">
                                        {movement.type}
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
                            );
                        })}
                </tbody>
            </table>
        </section>
    );
};

export default MovementList;
