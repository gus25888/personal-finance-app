import { useState, type JSX } from "react";
import { categories } from "../data/categories";
import {
    MOVEMENT_TYPE,
    MOVEMENT_TYPE_LABEL,
    type MovementType,
    type NewMovement,
} from "../types";

type Props = {
    onAddMovement: (movement: NewMovement) => void;
};

const MovementForm = ({ onAddMovement }: Props): JSX.Element => {
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [categoryId, setCategoryId] = useState(categories[0].id);
    const [type, setType] = useState<MovementType>(MOVEMENT_TYPE.EXPENSE);

    const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) =>
        setDate(event.target.value);
    const onChangeDescription = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => setDescription(event.target.value.trim());
    const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) =>
        setAmount(event.target.value === "" ? -1 : Number(event.target.value));
    const onChangeCategoryId = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setCategoryId(Number(event.target.value));
    const onChangeType = (event: React.ChangeEvent<HTMLInputElement>) =>
        setType(event.target.value as MovementType);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!date) {
            alert("La fecha es un valor requerido");
            return;
        }
        if (description.length < 1) {
            alert("La descripción es un valor requerido");
            return;
        }
        if (amount < 1) {
            alert("La cantidad es un valor requerido mayor a 0");
            return;
        }

        const newMovement: NewMovement = {
            date,
            description,
            amount,
            categoryId,
            type,
        };

        onAddMovement(newMovement);

        setDate("");
        setDescription("");
        setAmount(0);
        setCategoryId(categories[0].id);
        setType(MOVEMENT_TYPE.EXPENSE);
    };

    return (
        <div className="form-section">
            <p className="form-title">Enter a new Movement</p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="radio-option">
                        <input
                            type="radio"
                            id="movementType1"
                            name="type"
                            value={MOVEMENT_TYPE.INCOME}
                            checked={type === MOVEMENT_TYPE.INCOME}
                            onChange={onChangeType}
                        />
                        {MOVEMENT_TYPE_LABEL.INCOME}
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            id="movementType2"
                            name="type"
                            value={MOVEMENT_TYPE.EXPENSE}
                            checked={type === MOVEMENT_TYPE.EXPENSE}
                            onChange={onChangeType}
                        />
                        {MOVEMENT_TYPE_LABEL.EXPENSE}
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="movementDate">
                        Date
                    </label>
                    <input
                        id="movementDate"
                        className="form-input"
                        type="date"
                        value={date}
                        onChange={onChangeDate}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="movementDescription">
                        Description
                    </label>
                    <textarea
                        id="movementDescription"
                        className="form-input"
                        rows={3}
                        value={description}
                        onChange={onChangeDescription}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="movementAmount">
                        Amount
                    </label>
                    <input
                        id="movementAmount"
                        className="form-input"
                        type="number"
                        value={amount}
                        onChange={onChangeAmount}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="movementCategory">
                        Category
                    </label>
                    <div className="select-wrapper">
                        <select
                            id="movementCategory"
                            className="form-input"
                            value={categoryId}
                            onChange={onChangeCategoryId}
                        >
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
                </div>
                <button type="submit" className="form-button">
                    Save Movement
                </button>
            </form>
        </div>
    );
};

export default MovementForm;
