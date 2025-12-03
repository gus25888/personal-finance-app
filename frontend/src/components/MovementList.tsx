import type { JSX } from "react";
import type { Movement } from "../types";
import { categories } from "../data/categories";

type Props = {
    movements: Movement[];
};

const MovementList = ({ movements }: Props): JSX.Element => {
    return (
        <section className="table-section">
            <p className="table-title">Movements List</p>
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
                    {movements.map((movement) => {
                        const categoryName =
                            categories.find((c) => c.id === movement.categoryId)
                                ?.name || "N/A";
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
