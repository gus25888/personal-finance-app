import type { JSX } from "react";
import CategoriesList from "./CategoriesList";
import type { Category } from "../../domain/categories/types";

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
    return (
        <>
            <h2>Categories</h2>
            <div className="form-container">
                <p>Form... Coming Soon...</p>
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
