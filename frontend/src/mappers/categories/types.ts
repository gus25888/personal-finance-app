import type { CategoryType } from "../../domain/categories/types";

export type BackendEditCategory = {
    name?: string;
    type?: CategoryType;
};
