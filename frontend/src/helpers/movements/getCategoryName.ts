import type { Category } from "../../types";

export const getCategoryName = (
    categories: Category[],
    categoryId: Category["id"]
) => {
    return categories.find((c) => c.id === categoryId)?.name || "N/A";
};
