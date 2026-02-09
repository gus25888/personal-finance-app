import { useCallback, useEffect, useState, type JSX } from "react";

import {
    CATEGORY_FILTER_ALL,
    CATEGORY_TYPE_FILTER,
    CATEGORY_TYPE_LABEL,
    type CategoryFilter,
    type Movement,
    type CategoryTypeFilter,
    type CategoryType,
    type NewMovement,
} from "../types";

import { calculateTotals, getCategoryName } from "../helpers/movements/";
import { formatBackendError } from "../helpers/common/formatBackendErrors";

import MovementListFilters from "./MovementListFilters";
import { categories } from "../data/categories";
import { movementsService } from "../domain/movements";
import type { ServiceResult } from "../domain/common/ServiceResult";
import type { BackendError } from "../domain/common/BackendError";

type Props = {
    movementToEdit: Movement | null;
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
};

const MovementList = ({
    movementToEdit,
    onEditMovement,
    onClearEditMovement,
    registerCreateMovement,
    registerEditMovement,
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
    const [errorLoadingMovements, setErrorLoadingMovements] = useState<
        string | null
    >(null);

    const manageError = (resultError: BackendError) => {
        setErrorLoadingMovements(formatBackendError(resultError));
        setStateLoadingMovements(false);
    };

    const createMovement = useCallback(
        async (movement: NewMovement): Promise<ServiceResult<Movement>> => {
            setStateLoadingMovements(true);
            setErrorLoadingMovements(null);

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
        [],
    );

    const updateMovement = useCallback(
        async (
            id: number,
            movement: Partial<Movement>,
        ): Promise<ServiceResult<Movement>> => {
            setStateLoadingMovements(true);
            setErrorLoadingMovements(null);

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
        [onClearEditMovement],
    );

    const deleteMovement = async (id: number): Promise<ServiceResult<void>> => {
        setStateLoadingMovements(true);
        setErrorLoadingMovements(null);

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
            setStateLoadingMovements(true);
            setErrorLoadingMovements(null);

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
            } else {
                setErrorLoadingMovements(formatBackendError(result.error));
            }
            setStateLoadingMovements(false);
        };

        fetchMovements(
            movementType,
            movementCategory,
            movementStartDate,
            movementEndDate,
        );
    }, [movementType, movementCategory, movementStartDate, movementEndDate]);

    const { totalIncome, totalExpense, balance } = calculateTotals(movements);

    return (
        <section className="table-section">
            {errorLoadingMovements && (
                <div className="error-messages">{errorLoadingMovements}</div>
            )}
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
                                {getCategoryName(
                                    categories,
                                    movement.categoryId,
                                )}
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
