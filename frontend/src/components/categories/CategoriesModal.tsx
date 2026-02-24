import { useState, type JSX } from "react";

import { CATEGORY_TYPE_LABEL } from "../../types";
import {
    CATEGORY_TYPE,
    type Category,
    type CategoryType,
} from "../../domain/categories/types";

import CategoriesList from "./CategoriesList";

type Props = {
    categories: Category[];
    onEditCategory: () => void;
    onDeleteCategory: () => void;
};

const CategoriesModal = ({
    categories,
    onEditCategory,
    onDeleteCategory,
}: Props): JSX.Element => {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categoryType, setCategoryType] = useState<CategoryType>(
        CATEGORY_TYPE.EXPENSE,
    );

    const isCreateDisabled: boolean = categoryName.trim() === "";

    const onChangeCategoryName = (event: React.ChangeEvent<HTMLInputElement>) =>
        setCategoryName(event.target.value);

    const onChangeCategoryType = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => setCategoryType(event.target.value as CategoryType);

    const handleCreate = (event: React.FormEvent) => {
        event.preventDefault();
        return null;
    };

    return (
        <>
            <h2>Categories</h2>
            <div className="categories-form-row">
                <form>
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
                                {Object.values(CATEGORY_TYPE).map(
                                    (category) => (
                                        <option key={category} value={category}>
                                            {CATEGORY_TYPE_LABEL[category]}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={isCreateDisabled}
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
