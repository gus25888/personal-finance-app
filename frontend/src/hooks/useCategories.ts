import { useCallback, useMemo, useState } from "react";

import { categoriesService } from "../domain/categories";

import type { Category, NewCategory } from "../domain/categories/types";
import type { ServiceResult } from "../domain/common/types";

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

    const loadCategories: () => Promise<ServiceResult<void>> =
        useCallback(async () => {
            try {
                setLoadingCategories(true);

                const result = await categoriesService.getCategories();

                if (result.success) {
                    setCategories(result.data ?? []);
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
                setLoadingCategories(false);
            }
        }, []);

    const addCategory = useCallback(
        async (category: NewCategory): Promise<ServiceResult<void>> => {
            const result = await categoriesService.createCategory(category);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }

            const categoryCreated = result.data;

            setCategories((prevState) => [...prevState, categoryCreated]);

            return {
                success: true,
                data: undefined,
            };
        },
        [],
    );

    const editCategory = useCallback(
        async (
            id: number,
            category: Partial<Category>,
        ): Promise<ServiceResult<void>> => {
            const result = await categoriesService.updateCategory(id, category);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }

            const categoryUpdated = result.data;

            setCategories((prevState) =>
                prevState.map((prev) =>
                    prev.id === categoryUpdated.id ? categoryUpdated : prev,
                ),
            );

            return {
                success: true,
                data: undefined,
            };
        },
        [],
    );

    const removeCategory = useCallback(
        async (id: number): Promise<ServiceResult<void>> => {
            const result = await categoriesService.deleteCategory(id);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }

            setCategories((prevState) =>
                prevState.filter((prev) => prev.id !== id),
            );

            return {
                success: true,
                data: undefined,
            };
        },
        [],
    );

    return useMemo(
        () => ({
            categories,
            loadingCategories,
            loadCategories,
            addCategory,
            editCategory,
            removeCategory,
        }),
        [
            categories,
            loadingCategories,
            loadCategories,
            addCategory,
            editCategory,
            removeCategory,
        ],
    );
};
