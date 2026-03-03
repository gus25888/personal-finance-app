import type { JSX } from "react";
import {
    CATEGORY_FILTER_ALL,
    CATEGORY_FILTER_ALL_LABEL,
    CATEGORY_TYPE_FILTER,
    CATEGORY_TYPE_FILTER_LABEL,
} from "../../types";
import type { Category, CategoryType } from "../../domain/categories/types";
import type { MovementFilter } from "../../domain/movements/types";

// Explicación de onChangeFilter:
// En este punto con "extends keyof" se obtienen las claves de MovementFilter: "startDate", "categoryType", etc. como una unión de tipos, es decir, es igual a "startDate" | "categoryType" ..., lo cual se representa con la variable K.
// Esta variable se usa como base para definir la "key" esperada como parámetro, lo cual permite hacerlo extensible, ya que solo hay que modificar el type, en caso de querer agregar o modificar uno.
// Además, esta key se utiliza para definir el tipo del valor a esperar en la función, lo cual asegura que se envíe el tipo correcto de dato para la key que se está llenando, por ej. un number para CategoryId.
// Esto se puede denominar Tipado Dinámico Dependiente.

type FiltersProps = {
    filters: MovementFilter;
    onChangeFilter: <K extends keyof MovementFilter>(
        key: K,
        value: MovementFilter[K],
    ) => void;
    categories: Category[];
};

const MovementListFilters = ({
    filters,
    onChangeFilter,
    categories,
}: FiltersProps): JSX.Element => {
    const onChangeMovementType = (event: React.ChangeEvent<HTMLInputElement>) =>
        onChangeFilter(
            "categoryType",
            event.target.value === CATEGORY_TYPE_FILTER.ALL
                ? undefined
                : (event.target.value as CategoryType),
        );

    const onChangeMovementCategory = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) =>
        onChangeFilter(
            "categoryID",
            event.target.value === CATEGORY_FILTER_ALL
                ? undefined
                : Number(event.target.value),
        );

    const onChangeMovementStartDate = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        onChangeFilter("startDate", event.target.value || undefined);
    };

    const onChangeMovementEndDate = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => onChangeFilter("endDate", event.target.value || undefined);

    return (
        <>
            <div className="form-group">
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={CATEGORY_TYPE_FILTER.ALL}
                        checked={
                            (filters.categoryType ||
                                CATEGORY_TYPE_FILTER.ALL) ===
                            CATEGORY_TYPE_FILTER.ALL
                        }
                        onChange={onChangeMovementType}
                    />
                    {CATEGORY_TYPE_FILTER_LABEL.all}
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={CATEGORY_TYPE_FILTER.INCOME}
                        checked={
                            filters.categoryType === CATEGORY_TYPE_FILTER.INCOME
                        }
                        onChange={onChangeMovementType}
                    />
                    {CATEGORY_TYPE_FILTER_LABEL.income}
                </label>
                <label className="radio-option">
                    <input
                        type="radio"
                        name="movementTypeFilter"
                        value={CATEGORY_TYPE_FILTER.EXPENSE}
                        checked={
                            filters.categoryType ===
                            CATEGORY_TYPE_FILTER.EXPENSE
                        }
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
                            value={filters.categoryID}
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
                        value={filters.startDate}
                        onChange={onChangeMovementStartDate}
                    />
                </label>
                <label className="form-label">
                    End Date
                    <input
                        id="endDateFilter"
                        className="form-input"
                        type="date"
                        value={filters.endDate}
                        onChange={onChangeMovementEndDate}
                    />
                </label>
            </div>
        </>
    );
};

export default MovementListFilters;
