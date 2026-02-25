import type { JSX } from "react";

import { CATEGORY_TYPE_LABEL } from "../../types";
import type { ServiceResult } from "../../domain/common/types";
import type { Category } from "../../domain/categories/types";

type Props = {
    categories: Category[];
    onEditCategory: () => void;
    onDeleteCategory: (id: number) => Promise<ServiceResult<void>>;
};

const CategoriesList = ({
    categories,
    onEditCategory,
    onDeleteCategory,
}: Props): JSX.Element => {
    if (categories.length === 0) return <span>No categories found</span>;

    return (
        <section className="table-section">
            <table className="categories-table">
                <thead className="table-header">
                    <tr>
                        <th className="table-header-cell">Delete</th>
                        <th className="table-header-cell">Edit</th>
                        <th className="table-header-cell">Name</th>
                        <th className="table-header-cell">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id} className="table-row">
                            <td className="table-cell table-cell-center">
                                <button
                                    className="delete-button"
                                    onClick={() => {
                                        if (
                                            confirm(
                                                `Do you want to delete category '${category.name}'?`,
                                            )
                                        ) {
                                            onDeleteCategory(category.id);
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
                                        onEditCategory();
                                    }}
                                >
                                    E
                                </button>
                            </td>
                            <td className="table-cell table-cell-center">
                                {category.name}
                            </td>
                            <td className="table-cell table-cell-center">
                                {CATEGORY_TYPE_LABEL[category.type]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default CategoriesList;
