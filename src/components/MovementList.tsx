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
                    <td>Categoría</td>
                    <td>Tipo</td>
                    <td>Fecha</td>
                    <td>Descripción</td>
                    <td>Monto</td>
                </tr>
            </thead>
            <tbody>
                {movements.map((movement) => {
                    const categoryName =
                        categories.find((c) => c.id === movement.categoryId)
                            ?.name || "N/A";
                    return (
                        <tr>
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
