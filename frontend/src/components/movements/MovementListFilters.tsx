import type { JSX } from "react";
import {
    type CategoryFilter,
    type CategoryTypeFilter,
    CATEGORY_FILTER_ALL,
    CATEGORY_FILTER_ALL_LABEL,
    CATEGORY_TYPE_FILTER,
    CATEGORY_TYPE_FILTER_LABEL,
} from "../../types";
import type { Category } from "../../domain/categories/types";

type FiltersProps = {
    movementType: CategoryTypeFilter;
    setMovementType: React.Dispatch<React.SetStateAction<CategoryTypeFilter>>;
    movementCategory: CategoryFilter;
    setMovementCategory: React.Dispatch<React.SetStateAction<CategoryFilter>>;
    movementStartDate: string;
    setMovementStartDate: React.Dispatch<React.SetStateAction<string>>;
    movementEndDate: string;
    setMovementEndDate: React.Dispatch<React.SetStateAction<string>>;
    categories: Category[];
};

const MovementListFilters = ({
    movementType,
    setMovementType,
    movementCategory,
    setMovementCategory,
    movementStartDate,
    setMovementStartDate,
    movementEndDate,
    setMovementEndDate,
    categories,
}: FiltersProps): JSX.Element => {
    const onChangeMovementType = (event: React.ChangeEvent<HTMLInputElement>) =>
        setMovementType(event.target.value as CategoryTypeFilter);

    const onChangeMovementCategory = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => setMovementCategory(event.target.value as CategoryFilter);

    const onChangeMovementStartDate = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setMovementStartDate(event.target.value);

    const onChangeMovementEndDate = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setMovementEndDate(event.target.value);

    return (
        <>
            <div className="form-group">
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={CATEGORY_TYPE_FILTER.ALL}
                        checked={movementType === CATEGORY_TYPE_FILTER.ALL}
                        onChange={onChangeMovementType}
                    />
                    {CATEGORY_TYPE_FILTER_LABEL.all}
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={CATEGORY_TYPE_FILTER.INCOME}
                        checked={movementType === CATEGORY_TYPE_FILTER.INCOME}
                        onChange={onChangeMovementType}
                    />
                    {CATEGORY_TYPE_FILTER_LABEL.income}
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={CATEGORY_TYPE_FILTER.EXPENSE}
                        checked={movementType === CATEGORY_TYPE_FILTER.EXPENSE}
                        onChange={onChangeMovementType}
                    />
                    {CATEGORY_TYPE_FILTER_LABEL.expense}
                </label>
            </div>

            <div className="form-group">
                <label className="form-label">
                    Category
                    <div className="select-wrapper">
                        <select
                            className="form-input"
                            value={movementCategory}
                            onChange={onChangeMovementCategory}
                        >
                            <option
                                key={CATEGORY_FILTER_ALL}
                                value={CATEGORY_FILTER_ALL}
                            >
                                {CATEGORY_FILTER_ALL_LABEL}
                            </option>
                            {categories.map((category) => {
                                return (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </label>
            </div>

            <div className="form-group">
                <label className="form-label">
                    Start Date
                    <input
                        id="startDateFilter"
                        className="form-input"
                        type="date"
                        value={movementStartDate}
                        onChange={onChangeMovementStartDate}
                    />
                </label>
                <label className="form-label">
                    End Date
                    <input
                        id="endDateFilter"
                        className="form-input"
                        type="date"
                        value={movementEndDate}
                        onChange={onChangeMovementEndDate}
                    />
                </label>
            </div>
        </>
    );
};

export default MovementListFilters;
