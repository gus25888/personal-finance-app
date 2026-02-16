import "./App.css";

import { useEffect, useRef, useState, type JSX } from "react";

import type { Movement, NewMovement } from "./domain/movements/types";

import ErrorMessage from "./components/ErrorMessage";
import MovementForm from "./components/MovementForm";
import MovementList from "./components/MovementList";

import type { ServiceResult } from "./domain/common/ServiceResult";

import { HTTP_STATUS } from "./helpers/common/httpStatusCodes";
import { ERROR_TYPES } from "./helpers/common/errors";
import type { Category } from "./domain/categories/types";
import { categoriesService } from "./domain/categories";
import { formatBackendError } from "./helpers/common/formatBackendErrors";

function App(): JSX.Element {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await categoriesService.getCategories();

            if (result.success) {
                setCategories(result.data ?? []);
            } else {
                setErrorMessage(formatBackendError(result.error));
            }
        };

        fetchCategories();
    }, []);

    const [movementBeingEdited, setMovementBeingEdited] =
        useState<Movement | null>(null);

    const defineMovementToEdit = (movement: Movement) => {
        setMovementBeingEdited(movement);
    };
    const clearMovementToEdit = () => {
        setMovementBeingEdited(null);
    };

    const reportError = (errorText: string | null) => {
        setErrorMessage(errorText);
    };

    const createMovementRef =
        useRef<(movement: NewMovement) => Promise<ServiceResult<Movement>>>(
            null,
        );

    const addMovement = async (
        movement: NewMovement,
    ): Promise<ServiceResult<Movement>> => {
        if (!createMovementRef.current) {
            return {
                success: false,
                error: {
                    error: ERROR_TYPES.APPLICATION,
                    message: "The Application is not ready to create movements",
                    statusCode: HTTP_STATUS.INTERNAL_ERROR,
                },
            };
        }

        return await createMovementRef.current(movement);
    };

    const editMovementRef =
        useRef<
            (
                id: number,
                movement: Partial<Movement>,
            ) => Promise<ServiceResult<Movement>>
        >(null);

    const editMovement = async (
        id: number,
        movement: Partial<Movement>,
    ): Promise<ServiceResult<Movement>> => {
        if (!editMovementRef.current) {
            return {
                success: false,
                error: {
                    error: ERROR_TYPES.APPLICATION,
                    message: "The Application is not ready to edit movements",
                    statusCode: HTTP_STATUS.INTERNAL_ERROR,
                },
            };
        }

        return await editMovementRef.current(id, movement);
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Personal Finances</h1>
            <ErrorMessage message={errorMessage} />
            <MovementForm
                key={movementBeingEdited?.id ?? "new"}
                movementToEdit={movementBeingEdited}
                onAddMovement={addMovement}
                onEditMovement={editMovement}
                onClearEditMovement={clearMovementToEdit}
                onReportError={reportError}
                categories={categories}
            />
            <MovementList
                onReportError={reportError}
                movementToEdit={movementBeingEdited}
                onEditMovement={defineMovementToEdit}
                onClearEditMovement={clearMovementToEdit}
                registerCreateMovement={(fn) => {
                    createMovementRef.current = fn;
                }}
                registerEditMovement={(fn) => {
                    editMovementRef.current = fn;
                }}
                categories={categories}
            />
        </div>
    );
}

export default App;
