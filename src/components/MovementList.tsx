import type { JSX } from "react";
import type { Movement } from "../types";
import { categories } from "../data/categories";

type Props = {
    movements: Movement[];
};

const MovementList = ({ movements }: Props): JSX.Element => {
    const movementsTable = (
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
                {movements.map((movement) => {
                    const categoryName =
                        categories.find((c) => c.id === movement.categoryId)
                            ?.name || "N/A";
                    return (
                        <tr key={movement.id}>
                            <td>{categoryName}</td>
                            <td>{movement.type}</td>
                            <td>{movement.date}</td>
                            <td>{movement.description}</td>
                            <td>{movement.amount}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    return movementsTable;
};

export default MovementList;
