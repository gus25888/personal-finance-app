import "./App.css";

import { useRef, useState, type JSX } from "react";

import type { Movement, NewMovement } from "./types";
import MovementForm from "./components/MovementForm";
import MovementList from "./components/MovementList";
import type { ServiceResult } from "./domain/common/ServiceResult";

function App(): JSX.Element {
    const [movementBeingEdited, setMovementBeingEdited] =
        useState<Movement | null>(null);

    const defineMovementToEdit = (movement: Movement) => {
        setMovementBeingEdited(movement);
    };
    const clearMovementToEdit = () => {
        setMovementBeingEdited(null);
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
                    error: "FrontEnd",
                    message: "Create movement not initialized",
                    statusCode: 400,
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
                    error: "FrontEnd",
                    message: "Edit movement not initialized",
                    statusCode: 400,
                },
            };
        }

        return await editMovementRef.current(id, movement);
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Personal Finances</h1>
            <MovementForm
                movementToEdit={movementBeingEdited}
                onAddMovement={addMovement}
                onEditMovement={editMovement}
                onClearEditMovement={clearMovementToEdit}
            />
            <MovementList
                movementToEdit={movementBeingEdited}
                onEditMovement={defineMovementToEdit}
                onClearEditMovement={clearMovementToEdit}
                registerCreateMovement={(fn) => {
                    createMovementRef.current = fn;
                }}
                registerEditMovement={(fn) => {
                    editMovementRef.current = fn;
                }}
            />
        </div>
    );
}

export default App;
