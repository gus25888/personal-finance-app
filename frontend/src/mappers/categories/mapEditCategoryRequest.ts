import type { Category } from "../../domain/categories/types";
import type { BackendEditCategory } from "./types";

export const mapEditCategoryRequest = (
    category: Partial<Category>,
): BackendEditCategory => {
    const editData: BackendEditCategory = {};

    if (category.name !== undefined) {
        editData.name = category.name;
    }
    if (category.type !== undefined) {
        editData.type = category.type;
    }

    return editData;
};
