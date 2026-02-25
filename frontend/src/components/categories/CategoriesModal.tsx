import { useState, type JSX } from "react";

import { formatBackendError } from "../../infrastructure/formatBackendErrors";

import { CATEGORY_TYPE_LABEL } from "../../types";
import type { ServiceResult } from "../../domain/common/types";
import {
    NOTIFICATION_TYPES,
    type NotificationData,
} from "../../types/notification";
import {
    CATEGORY_TYPE,
    type Category,
    type CategoryType,
    type NewCategory,
} from "../../domain/categories/types";

import CategoriesList from "./CategoriesList";

type Props = {
    categories: Category[];
    onNotify: (notificationData: NotificationData) => void;
    onCreateCategory: (
        category: NewCategory,
    ) => Promise<ServiceResult<Category>>;
    onEditCategory: () => void;
    onDeleteCategory: () => void;
};

const CategoriesModal = ({
    categories,
    onNotify,
    onCreateCategory,
    onEditCategory,
    onDeleteCategory,
}: Props): JSX.Element => {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryType, setCategoryType] = useState<CategoryType>(
        CATEGORY_TYPE.EXPENSE,
    );
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const resetForm = () => {
        setCategoryName("");
        setCategoryType(CATEGORY_TYPE.EXPENSE);
        setIsCreating(false);
    };

    const isCreateDisabled: boolean = categoryName.trim() === "";

    const onChangeCategoryName = (event: React.ChangeEvent<HTMLInputElement>) =>
        setCategoryName(event.target.value);

    const onChangeCategoryType = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => setCategoryType(event.target.value as CategoryType);

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsCreating(true);

        const name = categoryName.trim();
        if (name.length === 0) {
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: "Name is required",
            });
            return;
        }

        const newCategory: NewCategory = {
            name,
            type: categoryType,
        };

        const result = await onCreateCategory(newCategory);

        if (result.success) {
            resetForm();
            onNotify({
                type: NOTIFICATION_TYPES.SUCCESS,
                message: "Category created successfully",
            });
        } else {
            setIsCreating(false);
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: formatBackendError(result.error),
            });
        }
    };

    return (
        <>
            <h2>Categories</h2>
            <div className="categories-form-row">
                <form onSubmit={handleCreate}>
                    <div className="field categoryName-field">
                        <label className="form-label" htmlFor="categoryName">
                            Name
                        </label>
                        <input
                            id="categoryName"
                            className="form-input"
                            type="text"
                            value={categoryName}
                            onChange={onChangeCategoryName}
                        />
                    </div>
                    <div className="field categoryType-field">
                        <label className="form-label" htmlFor="categoryType">
                            Type
                        </label>
                        <div className="select-wrapper">
                            <select
                                id="categoryType"
                                className="form-input"
                                value={categoryType}
                                onChange={onChangeCategoryType}
                            >
                                {Object.values(CATEGORY_TYPE).map((type) => (
                                    <option key={type} value={type}>
                                        {CATEGORY_TYPE_LABEL[type]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        disabled={isCreateDisabled || isCreating}
                        className="form-button creating"
                    >
                        Save Category
                    </button>
                </form>
            </div>
            <hr />
            <div className="list-container">
                <CategoriesList
                    categories={categories}
                    onEditCategory={onEditCategory}
                    onDeleteCategory={onDeleteCategory}
                />
            </div>
        </>
    );
};

export default CategoriesModal;
