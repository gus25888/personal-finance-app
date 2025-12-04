import type { JSX } from "react";
import {
    type MovementTypeFilter,
    MOVEMENT_TYPE_FILTER,
    MOVEMENT_TYPE_FILTER_LABEL,
} from "../types";

type FiltersProps = {
    movementType: MovementTypeFilter;
    setMovementType: React.Dispatch<React.SetStateAction<MovementTypeFilter>>;
};

const MovementListFilters = ({
    movementType,
    setMovementType,
}: FiltersProps): JSX.Element => {
    const onChangeMovementType = (event: React.ChangeEvent<HTMLInputElement>) =>
        setMovementType(event.target.value as MovementTypeFilter);

    return (
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
    );
};

export default MovementListFilters;
