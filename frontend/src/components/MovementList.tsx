import { useCallback, useEffect, useState, type JSX } from "react";

import {
    CATEGORY_FILTER_ALL,
    CATEGORY_TYPE_FILTER,
    CATEGORY_TYPE_LABEL,
    type CategoryFilter,
    type CategoryTypeFilter,
    type NewMovement,
} from "../types";

import { calculateTotals } from "../helpers/movements/";
import { formatBackendError } from "../helpers/common/formatBackendErrors";

import { movementsService } from "../domain/movements";
import type { ServiceResult } from "../domain/common/ServiceResult";
import type { BackendError } from "../domain/common/BackendError";
import type { Category, CategoryType } from "../domain/categories/types";
import type { Movement } from "../domain/movements/types";

import MovementListFilters from "./MovementListFilters";

type Props = {
    movementToEdit: Movement | null;
    onReportError: (errorText: string | null) => void;
    onEditMovement: (movement: Movement) => void;
    onClearEditMovement: () => void;
    registerCreateMovement: (
        fn: (movement: NewMovement) => Promise<ServiceResult<Movement>>,
    ) => void;
    registerEditMovement: (
        fn: (
            id: number,
            movement: Partial<Movement>,
        ) => Promise<ServiceResult<Movement>>,
    ) => void;
    categories: Category[];
};

const MovementList = ({
    movementToEdit,
    onReportError,
    onEditMovement,
    onClearEditMovement,
    registerCreateMovement,
    registerEditMovement,
    categories,
}: Props): JSX.Element => {
    const [movementType, setMovementType] = useState<CategoryTypeFilter>(
        CATEGORY_TYPE_FILTER.ALL,
    );
    const [movementCategory, setMovementCategory] =
        useState<CategoryFilter>(CATEGORY_FILTER_ALL);
    const [movementStartDate, setMovementStartDate] = useState<string>("");
    const [movementEndDate, setMovementEndDate] = useState<string>("");

    const [movements, setMovements] = useState<Movement[]>([]);

    const [stateLoadingMovements, setStateLoadingMovements] =
        useState<boolean>(false);

    const manageError = useCallback(
        (resultError: BackendError) => {
            onReportError(formatBackendError(resultError));
            setStateLoadingMovements(false);
        },
        [onReportError],
    );

    const startOperation = useCallback(() => {
        setStateLoadingMovements(true);
        onReportError(null);
    }, [onReportError]);

    const createMovement = useCallback(
        async (movement: NewMovement): Promise<ServiceResult<Movement>> => {
            startOperation();

            const result = await movementsService.createMovement(movement);

            if (!result.success) {
                manageError(result.error);

                return {
                    success: false,
                    error: result.error,
                };
            }

            const movementCreated = result.data;

            setMovements((prevState) => [...prevState, movementCreated]);

            setStateLoadingMovements(false);

            return {
                success: true,
                data: movementCreated,
            };
        },
        [manageError, startOperation],
    );

    const updateMovement = useCallback(
        async (
            id: number,
            movement: Partial<Movement>,
        ): Promise<ServiceResult<Movement>> => {
            startOperation();

            const result = await movementsService.updateMovement(id, movement);

            if (!result.success) {
                manageError(result.error);

                return {
                    success: false,
                    error: result.error,
                };
            }

            const movementUpdated = result.data;

            setMovements((prevState) =>
                prevState.map((prev) =>
                    prev.id === movementUpdated.id ? movementUpdated : prev,
                ),
            );

            // Se limpia el movimiento que estaba en edición para "refrescar" el formulario.
            onClearEditMovement();
            setStateLoadingMovements(false);

            return {
                success: true,
                data: movementUpdated,
            };
        },
        [onClearEditMovement, manageError, startOperation],
    );

    const deleteMovement = async (id: number): Promise<ServiceResult<void>> => {
        startOperation();

        const result = await movementsService.deleteMovement(id);

        if (!result.success) {
            manageError(result.error);

            return {
                success: false,
                error: result.error,
            };
        }

        setMovements((prevState) => prevState.filter((prev) => prev.id !== id));

        // Se "refresca" el formulario, en caso de que el movimiento que se borra estaba cargado en el.
        if (movementToEdit?.id === id) {
            onClearEditMovement();
        }

        setStateLoadingMovements(false);

        return {
            success: true,
            data: undefined,
        };
    };

    /* Registro de función para crear  */
    useEffect(() => {
        registerCreateMovement(createMovement);
    }, [registerCreateMovement, createMovement]);

    /* Registro de función para editar  */
    useEffect(() => {
        registerEditMovement(updateMovement);
    }, [registerEditMovement, updateMovement]);

    /* Obtención de datos de Movements */
    useEffect(() => {
        const fetchMovements = async (
            movementType: CategoryType | typeof CATEGORY_TYPE_FILTER.ALL,
            movementCategory: number | typeof CATEGORY_FILTER_ALL,
            movementStartDate: string,
            movementEndDate: string,
        ) => {
            startOperation();

            const filters = {
                startDate: movementStartDate || undefined,
                endDate: movementEndDate || undefined,
                categoryID:
                    movementCategory === CATEGORY_FILTER_ALL
                        ? undefined
                        : movementCategory,
                categoryType:
                    movementType === CATEGORY_TYPE_FILTER.ALL
                        ? undefined
                        : movementType,
            };

            const result = await movementsService.getMovements(filters);

            if (result.success) {
                setMovements(result.data ?? []);
                setStateLoadingMovements(false);
            } else {
                manageError(result.error);
            }
        };

        fetchMovements(
            movementType,
            movementCategory,
            movementStartDate,
            movementEndDate,
        );
    }, [
        movementType,
        movementCategory,
        movementStartDate,
        movementEndDate,
        manageError,
        startOperation,
    ]);

    const { totalIncome, totalExpense, balance } = calculateTotals(movements);

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
                categories={categories}
            />
            <p className="movement-totals-container">
                <span className="movement-total-item">{`Income: $ ${totalIncome}`}</span>
                <span className="movement-total-item">{`Expenses: $ ${totalExpense}`}</span>
                <span className="movement-total-item">{`Balance: $ ${balance}`}</span>
            </p>
            {stateLoadingMovements && <p>Loading movements...</p>}
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
                    {movements.map((movement) => (
                        <tr key={movement.id} className="table-row">
                            <td className="table-cell table-cell-center">
                                <button
                                    className="delete-button"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `¿Eliminar movimiento '${movement.description}'?`,
                                            )
                                        ) {
                                            deleteMovement(movement.id);
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
                                    E
                                </button>
                            </td>
                            <td className="table-cell table-cell-center">
                                {movement.categoryName}
                            </td>
                            <td className="table-cell table-cell-center">
                                {CATEGORY_TYPE_LABEL[movement.type]}
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
