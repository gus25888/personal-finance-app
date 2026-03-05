import { useCallback, useEffect, useMemo, useState } from "react";

import type { ServiceResult } from "../domain/common/types";
import type {
    Movement,
    MovementFilter,
    NewMovement,
} from "../domain/movements/types";
import { movementsService } from "../domain/movements";

import { formatDateForFilters } from "../helpers/common/dateFormatter";

const getDefaultFilters = (): MovementFilter => {
    const today = new Date();
    const oneMonthBeforeToday = new Date(today);
    oneMonthBeforeToday.setDate(oneMonthBeforeToday.getDate() - 30);
    return {
        startDate: formatDateForFilters(oneMonthBeforeToday),
        endDate: formatDateForFilters(today),
        categoryID: undefined,
        categoryType: undefined,
    };
};

export const useMovements = () => {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loadingMovements, setLoadingMovements] = useState<boolean>(false);
    const [filters, setFilters] = useState<MovementFilter>(getDefaultFilters);
    const [filterError, setFilterError] = useState<string | null>(null);

    /*
        Para evitar re-renders innecesarios
        se requiere hacer uso de useCallback
        para cada función usada en la carga de datos.
    */
    const getFilterErrors = useCallback((): string | null => {
        const { startDate, endDate } = filters;

        if (startDate && endDate && startDate > endDate) {
            return "Start Date must be before End Date";
        }

        return null;
    }, [filters]);

    const loadMovements = useCallback(async (): Promise<
        ServiceResult<void>
    > => {
        try {
            setFilterError(null);

            const filterErrors = getFilterErrors();
            if (filterErrors) {
                setFilterError(filterErrors);
                return {
                    success: false,
                    error: "Filters have errors.",
                };
            }

            setLoadingMovements(true);

            const result = await movementsService.getMovements(filters);

            if (result.success) {
                setMovements(result.data ?? []);
                return {
                    success: true,
                    data: undefined,
                };
            } else {
                return {
                    success: false,
                    error: result.error,
                };
            }
        } finally {
            setLoadingMovements(false);
        }
    }, [filters, getFilterErrors]);

    useEffect(() => {
        loadMovements();
    }, [loadMovements]);

    const addMovement = useCallback(
        async (movement: NewMovement): Promise<ServiceResult<void>> => {
            try {
                setLoadingMovements(true);

                const result = await movementsService.createMovement(movement);

                if (!result.success) {
                    return {
                        success: false,
                        error: result.error,
                    };
                }

                const movementCreated = result.data;

                setMovements((prevState) => [...prevState, movementCreated]);

                return {
                    success: true,
                    data: undefined,
                };
            } finally {
                setLoadingMovements(false);
            }
        },
        [],
    );

    const editMovement = useCallback(
        async (
            id: number,
            movement: Partial<Movement>,
        ): Promise<ServiceResult<void>> => {
            try {
                setLoadingMovements(true);

                const result = await movementsService.updateMovement(
                    id,
                    movement,
                );

                if (!result.success) {
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

                return {
                    success: true,
                    data: undefined,
                };
            } finally {
                setLoadingMovements(false);
            }
        },
        [],
    );

    const removeMovement = useCallback(
        async (id: number): Promise<ServiceResult<void>> => {
            try {
                setLoadingMovements(true);

                const result = await movementsService.deleteMovement(id);

                if (!result.success) {
                    return {
                        success: false,
                        error: result.error,
                    };
                }

                setMovements((prevState) =>
                    prevState.filter((prev) => prev.id !== id),
                );

                return {
                    success: true,
                    data: undefined,
                };
            } finally {
                setLoadingMovements(false);
            }
        },
        [],
    );

    return useMemo(
        () => ({
            movements,
            loadingMovements,
            filters,
            setFilters,
            filterError,
            addMovement,
            editMovement,
            removeMovement,
        }),
        [
            movements,
            loadingMovements,
            filters,
            setFilters,
            filterError,
            addMovement,
            editMovement,
            removeMovement,
        ],
    );
};
