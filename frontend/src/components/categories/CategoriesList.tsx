import { useState, type JSX } from "react";

import { CATEGORY_TYPE_LABEL } from "../../types";
import {
    NOTIFICATION_TYPES,
    type NotificationData,
} from "../../types/notification";
import type { ServiceResult } from "../../domain/common/types";
import {
    CATEGORY_TYPE,
    type Category,
    type CategoryType,
} from "../../domain/categories/types";

type Props = {
    categories: Category[];
    onEditCategory: (
        id: number,
        category: Partial<Category>,
    ) => Promise<ServiceResult<void>>;
    onDeleteCategory: (id: number) => Promise<ServiceResult<void>>;
    onNotify: (notificationData: NotificationData) => void;
};

const CategoriesList = ({
    categories,
    onEditCategory,
    onDeleteCategory,
    onNotify,
}: Props): JSX.Element => {
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState<string>("");
    const [editType, setEditType] = useState<CategoryType>(
        CATEGORY_TYPE.EXPENSE,
    );

    if (categories.length === 0) return <span>No categories found</span>;

    const handleEditClick = (category: Category) => {
        setEditId(category.id);
        setEditName(category.name);
        setEditType(category.type);
    };

    const handleSave = async () => {
        if (!editId) return;

        const name = editName.trim();
        if (name.length === 0) {
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: "Name is required",
            });
            return;
        }

        setIsSaving(true);

        const categoryToSave: Partial<Category> = {
            name: editName,
            type: editType,
        };

        const result = await onEditCategory(editId, categoryToSave);

        setIsSaving(false);

        if (result.success) {
            setEditId(null);
        }
    };
    const cancelEdition = () => {
        setEditId(null);
        setEditName("");
        setEditType(CATEGORY_TYPE.EXPENSE);
    };

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
                    {categories.map((category) => {
                        if (editId === category.id) {
                            return (
                                <tr key={category.id} className="table-row">
                                    <td className="table-cell table-cell-center"></td>
                                    <td className="table-cell table-cell-center">
                                        <button
                                            className="form-button editing"
                                            onClick={handleSave}
                                            disabled={isSaving}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            className={`form-button`}
                                            onClick={cancelEdition}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                    <td className="table-cell table-cell-center">
                                        <input
                                            type="text"
                                            id="editCategoryName"
                                            className="form-input"
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>,
                                            ) => {
                                                setEditName(event.target.value);
                                            }}
                                            value={editName}
                                        />
                                    </td>
                                    <td className="table-cell table-cell-center">
                                        <div className="select-wrapper">
                                            <select
                                                id="editCategoryType"
                                                className="form-input"
                                                value={editType}
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) => {
                                                    setEditType(
                                                        event.target
                                                            .value as CategoryType,
                                                    );
                                                }}
                                            >
                                                {Object.values(
                                                    CATEGORY_TYPE,
                                                ).map((type) => (
                                                    <option
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {
                                                            CATEGORY_TYPE_LABEL[
                                                                type
                                                            ]
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            );
                        } else {
                            return (
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
                                                    onDeleteCategory(
                                                        category.id,
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
                                            onClick={() =>
                                                handleEditClick(category)
                                            }
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
                            );
                        }
                    })}
                </tbody>
            </table>
        </section>
    );
};

export default CategoriesList;
