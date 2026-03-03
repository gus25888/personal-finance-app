import { useCallback, useEffect, useMemo, useState } from "react";

import type { ServiceResult } from "../domain/common/types";
import type {
    Movement,
    MovementFilter,
    NewMovement,
} from "../domain/movements/types";
import { movementsService } from "../domain/movements";

export const useMovements = () => {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loadingMovements, setLoadingMovements] = useState<boolean>(false);
    const [filters, setFilters] = useState<MovementFilter>({
        startDate: undefined,
        endDate: undefined,
        categoryID: undefined,
        categoryType: undefined,
    });

    useEffect(() => {
        const loadMovements = async (
            filters: MovementFilter,
        ): Promise<ServiceResult<void>> => {
            try {
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
        };

        loadMovements(filters);
    }, [filters]);

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
            addMovement,
            editMovement,
            removeMovement,
        }),
        [
            movements,
            loadingMovements,
            filters,
            setFilters,
            addMovement,
            editMovement,
            removeMovement,
        ],
    );
};
