import type { JSX } from "react";
import {
    type CategoryFilter,
    type MovementTypeFilter,
    CATEGORY_FILTER_ALL,
    CATEGORY_FILTER_ALL_LABEL,
    MOVEMENT_TYPE_FILTER,
    MOVEMENT_TYPE_FILTER_LABEL,
} from "../types";
import { categories } from "../data/categories";

type FiltersProps = {
    movementType: MovementTypeFilter;
    setMovementType: React.Dispatch<React.SetStateAction<MovementTypeFilter>>;
    movementCategory: CategoryFilter;
    setMovementCategory: React.Dispatch<React.SetStateAction<CategoryFilter>>;
    movementStartDate: string;
    setMovementStartDate: React.Dispatch<React.SetStateAction<string>>;
    movementEndDate: string;
    setMovementEndDate: React.Dispatch<React.SetStateAction<string>>;
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
}: FiltersProps): JSX.Element => {
    const onChangeMovementType = (event: React.ChangeEvent<HTMLInputElement>) =>
        setMovementType(event.target.value as MovementTypeFilter);

    const onChangeMovementCategory = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => setMovementCategory(event.target.value as CategoryFilter);

    const onChangeMovementStartDate = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => setMovementStartDate(event.target.value);

    const onChangeMovementEndDate = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => setMovementEndDate(event.target.value);

    return (
        <>
            <div className="form-group">
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={MOVEMENT_TYPE_FILTER.ALL}
                        checked={movementType === MOVEMENT_TYPE_FILTER.ALL}
                        onChange={onChangeMovementType}
                    />
                    {MOVEMENT_TYPE_FILTER_LABEL.ALL}
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={MOVEMENT_TYPE_FILTER.INCOME}
                        checked={movementType === MOVEMENT_TYPE_FILTER.INCOME}
                        onChange={onChangeMovementType}
                    />
                    {MOVEMENT_TYPE_FILTER_LABEL.INCOME}
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={MOVEMENT_TYPE_FILTER.EXPENSE}
                        checked={movementType === MOVEMENT_TYPE_FILTER.EXPENSE}
                        onChange={onChangeMovementType}
                    />
                    {MOVEMENT_TYPE_FILTER_LABEL.EXPENSE}
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
