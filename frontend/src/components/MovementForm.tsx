import { useEffect, useState, type JSX } from "react";
import { categories } from "../data/categories";
import {
    CATEGORY_TYPE,
    CATEGORY_TYPE_LABEL,
    type Movement,
    type CategoryType,
    type NewMovement,
} from "../types";
import type { ServiceResult } from "../domain/common/ServiceResult";
import { formatBackendError } from "../helpers/common/formatBackendErrors";

type Props = {
    movementToEdit: Movement | null;
    onAddMovement: (movement: NewMovement) => Promise<ServiceResult<Movement>>;
    onEditMovement: (
        id: number,
        movement: Partial<Movement>,
    ) => Promise<ServiceResult<Movement>>;
    onClearEditMovement: () => void;
};

const MovementForm = ({
    movementToEdit,
    onAddMovement,
    onEditMovement,
    onClearEditMovement,
}: Props): JSX.Element => {
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<string>("");
    const [categoryId, setCategoryId] = useState(categories[0].id);
    const [type, setType] = useState<CategoryType>(CATEGORY_TYPE.EXPENSE);

    const resetForm = () => {
        setDate("");
        setDescription("");
        setAmount("");
        setCategoryId(categories[0].id);
        setType(CATEGORY_TYPE.EXPENSE);
    };

    useEffect(() => {
        if (movementToEdit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDate(movementToEdit.date);
            setDescription(movementToEdit.description);
            setAmount(movementToEdit.amount.toString());
            setCategoryId(movementToEdit.categoryId);
            setType(movementToEdit.type);
        } else {
            resetForm();
        }
    }, [movementToEdit]);

    const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) =>
        setDate(event.target.value);
    const onChangeDescription = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => setDescription(event.target.value);
    const onChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) =>
        setAmount(
            event.target.value === "" || isNaN(Number(event.target.value))
                ? ""
                : event.target.value,
        );
    const onChangeCategoryId = (event: React.ChangeEvent<HTMLSelectElement>) =>
        setCategoryId(Number(event.target.value));
    const onChangeType = (event: React.ChangeEvent<HTMLInputElement>) =>
        setType(event.target.value as CategoryType);

    const cancelEdition = () => {
        resetForm();
        onClearEditMovement();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const cleanedDescription = description.trim();

        if (!date) {
            alert("La fecha es un valor requerido");
            return;
        }
        if (cleanedDescription.length < 1) {
            alert("La descripción es un valor requerido");
            return;
        }
        if (Number(amount) < 1) {
            alert("La cantidad es un valor requerido mayor a 0");
            return;
        }

        if (movementToEdit) {
            const editedMovement: Movement = {
                ...movementToEdit,
                date,
                description: cleanedDescription,
                amount: Number(amount),
                categoryId,
                type,
            };

            const result = await onEditMovement(
                movementToEdit.id,
                editedMovement,
            );

            if (result.success) {
                resetForm();
                alert("Registro modificado correctamente");
            } else {
                const message = formatBackendError(result.error);

                alert(`Error: ${message}`);
            }
        } else {
            const newMovement: NewMovement = {
                date,
                description: cleanedDescription,
                amount: Number(amount),
                categoryId,
                type,
            };

            const result = await onAddMovement(newMovement);

            if (result.success) {
                resetForm();
                alert("Registro creado correctamente");
            } else {
                const message = formatBackendError(result.error);

                alert(`Error: ${message}`);
            }
        }
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
                            value={CATEGORY_TYPE.INCOME}
                            checked={type === CATEGORY_TYPE.INCOME}
                            onChange={onChangeType}
                        />
                        {CATEGORY_TYPE_LABEL.income}
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            id="movementType2"
                            name="type"
                            value={CATEGORY_TYPE.EXPENSE}
                            checked={type === CATEGORY_TYPE.EXPENSE}
                            onChange={onChangeType}
                        />
                        {CATEGORY_TYPE_LABEL.expense}
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
                <button
                    type="submit"
                    className={`form-button ${movementToEdit ? "editing" : "creating"}`}
                >
                    {movementToEdit ? "Update Movement" : "Save Movement"}
                </button>
                {movementToEdit && (
                    <button
                        type="button"
                        className={`form-button`}
                        onClick={cancelEdition}
                    >
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default MovementForm;
