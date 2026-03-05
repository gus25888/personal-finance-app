import { useCallback, useEffect, type JSX } from "react";

import { CATEGORY_TYPE_LABEL } from "../../types";

import { calculateTotals } from "../../helpers/movements";

import type { ServiceResult } from "../../domain/common/types";
import type { Category } from "../../domain/categories/types";
import type {
    Movement,
    MovementFilter,
    NewMovement,
} from "../../domain/movements/types";

import MovementListFilters from "./MovementListFilters";

import { useMovements } from "../../hooks/useMovements";

type Props = {
    movementToEdit: Movement | null;
    onHandleServiceOperation: (
        operation: () => Promise<ServiceResult<void>>,
        showSuccessMessage?: boolean,
    ) => Promise<ServiceResult<void>>;
    onEditMovement: (movement: Movement) => void;
    onClearEditMovement: () => void;
    registerCreateMovement: (
        fn: (movement: NewMovement) => Promise<ServiceResult<void>>,
    ) => void;
    registerEditMovement: (
        fn: (
            id: number,
            movement: Partial<Movement>,
        ) => Promise<ServiceResult<void>>,
    ) => void;
    categories: Category[];
};

const MovementList = ({
    movementToEdit,
    onHandleServiceOperation,
    onEditMovement,
    onClearEditMovement,
    registerCreateMovement,
    registerEditMovement,
    categories,
}: Props): JSX.Element => {
    const {
        movements,
        loadingMovements,
        filters,
        setFilters,
        filterError,
        addMovement,
        editMovement,
        removeMovement,
    } = useMovements();

    const updateFilter = useCallback(
        <K extends keyof MovementFilter>(key: K, value: MovementFilter[K]) => {
            setFilters((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        [setFilters],
    );

    const createMovement = useCallback(
        async (movement: NewMovement): Promise<ServiceResult<void>> =>
            onHandleServiceOperation(() => addMovement(movement)),
        [onHandleServiceOperation, addMovement],
    );

    // /* Registro de función para crear  */
    useEffect(() => {
        registerCreateMovement(createMovement);
    }, [registerCreateMovement, createMovement]);

    const updateMovement = useCallback(
        async (
            id: number,
            movement: Partial<Movement>,
        ): Promise<ServiceResult<void>> =>
            onHandleServiceOperation(async () => {
                const result = await editMovement(id, movement);
                if (result.success) {
                    onClearEditMovement();
                }
                return result;
            }),
        [onHandleServiceOperation, editMovement, onClearEditMovement],
    );

    // /* Registro de función para editar  */
    useEffect(() => {
        registerEditMovement(updateMovement);
    }, [registerEditMovement, updateMovement]);

    const deleteMovement = useCallback(
        async (id: number): Promise<ServiceResult<void>> =>
            onHandleServiceOperation(async () => {
                const result = await removeMovement(id);
                if (result.success) {
                    if (movementToEdit?.id === id) {
                        onClearEditMovement();
                    }
                }
                return result;
            }),
        [
            onHandleServiceOperation,
            removeMovement,
            onClearEditMovement,
            movementToEdit,
        ],
    );

    const { totalIncome, totalExpense, balance } = calculateTotals(movements);

    return (
        <section className="table-section">
            {loadingMovements && <p>Loading movements...</p>}
            {!loadingMovements && (
                <>
                    <p className="table-title">Movements List</p>
                    <MovementListFilters
                        filters={filters}
                        filterError={filterError}
                        onChangeFilter={updateFilter}
                        categories={categories}
                    />
                    <p className="movement-totals-container">
                        <span className="movement-total-item">{`Income: $ ${totalIncome}`}</span>
                        <span className="movement-total-item">{`Expenses: $ ${totalExpense}`}</span>
                        <span className="movement-total-item">{`Balance: $ ${balance}`}</span>
                    </p>
                    <table className="movements-table">
                        <thead className="table-header">
                            <tr>
                                <th className="table-header-cell">Delete</th>
                                <th className="table-header-cell">Edit</th>
                                <th className="table-header-cell">Category</th>
                                <th className="table-header-cell">
                                    Category Type
                                </th>
                                <th className="table-header-cell">Date</th>
                                <th className="table-header-cell">
                                    Description
                                </th>
                                <th className="table-header-cell">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements.map((movement) => (
                                <tr key={movement.id} className="table-row">
                                    <td className="table-cell table-cell-center">
                                        <button
                                            className="delete-button"
                                            onClick={async () => {
                                                if (
                                                    confirm(
                                                        `Do you want to delete movement '${movement.description}'?`,
                                                    )
                                                ) {
                                                    await deleteMovement(
                                                        movement.id,
                                                    );
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
                                        {
                                            CATEGORY_TYPE_LABEL[
                                                movement.categoryType
                                            ]
                                        }
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
                </>
            )}
        </section>
    );
};

export default MovementList;
