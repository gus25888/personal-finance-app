import { useState, type JSX } from "react";
import { formatBackendError } from "../../infrastructure/formatBackendErrors";
import type { ServiceResult } from "../../domain/common/types";
import { type Category } from "../../domain/categories/types";
import { type Movement, type NewMovement } from "../../domain/movements/types";
import { CATEGORY_TYPE_LABEL } from "../../types";
import {
    NOTIFICATION_TYPES,
    type NotificationData,
} from "../../types/notification";

type Props = {
    movementToEdit: Movement | null;
    onAddMovement: (movement: NewMovement) => Promise<ServiceResult<Movement>>;
    onEditMovement: (
        id: number,
        movement: Partial<Movement>,
    ) => Promise<ServiceResult<Movement>>;
    onClearEditMovement: () => void;
    onNotify: (notificationData: NotificationData) => void;
    categories: Category[];
};

const MovementForm = ({
    movementToEdit,
    onAddMovement,
    onEditMovement,
    onClearEditMovement,
    onNotify,
    categories,
}: Props): JSX.Element => {
    const [date, setDate] = useState<string>(movementToEdit?.date ?? "");
    const [description, setDescription] = useState<string>(
        movementToEdit?.description ?? "",
    );
    const [amount, setAmount] = useState<string>(
        movementToEdit?.amount.toString() ?? "",
    );
    const [categoryId, setCategoryId] = useState<Category["id"] | null>(
        movementToEdit?.categoryId ?? null,
    );

    const resetForm = () => {
        setDate("");
        setDescription("");
        setAmount("");
        setCategoryId(null);
    };

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
        setCategoryId(
            event.target.value === "" ? null : Number(event.target.value),
        );

    const cancelEdition = () => {
        resetForm();
        onClearEditMovement();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const cleanedDescription = description.trim();

        if (!date) {
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: "Date is required",
            });
            return;
        }
        if (cleanedDescription.length < 5) {
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: "Description must have at least 5 characters",
            });
            return;
        }
        if (Number(amount) < 1) {
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: "Amount must be greater than 0",
            });
            return;
        }
        if (typeof categoryId !== "number") {
            onNotify({
                type: NOTIFICATION_TYPES.ERROR,
                message: "Category is required",
            });
            return;
        }

        if (movementToEdit) {
            const editedMovement: Movement = {
                ...movementToEdit,
                date,
                description: cleanedDescription,
                amount: Number(amount),
                categoryId,
            };

            const result = await onEditMovement(
                movementToEdit.id,
                editedMovement,
            );

            if (result.success) {
                resetForm();
                onNotify({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: "Movement updated successfully",
                });
            } else {
                onNotify({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: formatBackendError(result.error),
                });
            }
        } else {
            const newMovement: NewMovement = {
                date,
                description: cleanedDescription,
                amount: Number(amount),
                categoryId,
            };

            const result = await onAddMovement(newMovement);

            if (result.success) {
                resetForm();
                onNotify({
                    type: NOTIFICATION_TYPES.SUCCESS,
                    message: "Movement created successfully",
                });
            } else {
                onNotify({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: formatBackendError(result.error),
                });
            }
        }
    };

    return (
        <div className="form-section">
            <p className="form-title">Enter a new Movement</p>
            <form onSubmit={handleSubmit}>
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
                            value={categoryId ?? ""}
                            onChange={onChangeCategoryId}
                        >
                            <option key={0} value={""}>
                                {"--- Select a category ---"}
                            </option>
                            {categories.map((category) => {
                                return (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {`${category.name} - (${CATEGORY_TYPE_LABEL[category.type]})`}
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
