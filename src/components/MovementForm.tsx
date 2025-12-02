import { useState, type JSX } from "react";
import { categories } from "../data/categories";
import type { MovementType, NewMovement } from "../types";

type Props = {
    onAddMovement: (movement: NewMovement) => void;
};

const MovementForm = ({ onAddMovement }: Props): JSX.Element => {
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState(0);
    const [categoryId, setCategoryId] = useState(categories[0].id);
    const [type, setType] = useState<MovementType>("expense");

    const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) =>
        setDate(event.target.value);
    const onChangeDescription = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => setDescription(event.target.value);
    const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) =>
        setAmount(event.target.value === "" ? 0 : Number(event.target.value));
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
        setType("expense");

        return newMovement;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="movementType1">
                    <input
                        type="radio"
                        id="movementType1"
                        name="type"
                        value="income"
                        checked={type === "income"}
                        onChange={onChangeType}
                    />
                    {"Income"}
                </label>
                <label htmlFor="movementType2">
                    <input
                        type="radio"
                        id="movementType2"
                        name="type"
                        value="expense"
                        checked={type === "expense"}
                        onChange={onChangeType}
                    />
                    {"Expense"}
                </label>
            </div>
            <label htmlFor="movementDate">Date</label>
            <input
                id="movementDate"
                type="date"
                value={date}
                onChange={onChangeDate}
            />
            <label htmlFor="movementDescription">Description</label>
            <textarea
                id="movementDescription"
                value={description}
                onChange={onChangeDescription}
            />
            <label htmlFor="movementAmount">Amount</label>
            <input
                id="movementAmount"
                type="number"
                value={amount}
                onChange={onChangeAmount}
            />

            <label htmlFor="movementCategory">Category</label>
            <div>
                <select
                    id="movementCategory"
                    value={categoryId}
                    onChange={onChangeCategoryId}
                >
                    {categories.map((category) => {
                        return (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <button type="submit">Save Movement</button>
        </form>
    );
};

export default MovementForm;
