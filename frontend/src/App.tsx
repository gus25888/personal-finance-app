import "./App.css";

import { useRef, useState, type JSX } from "react";

import type { Movement, NewMovement } from "./types";
import MovementForm from "./components/MovementForm";
import MovementList from "./components/MovementList";
import type { ServiceResult } from "./domain/common/ServiceResult";

function App(): JSX.Element {
    /*
    const [movementBeingEdited, setMovementBeingEdited] =
        useState<Movement | null>(null);

    const removeMovement = (id: Movement["id"]) => {
        setMovements((mov) => mov.filter((m) => m.id !== id));
    };

    const defineMovementToEdit = (movement: Movement) => {
        setMovementBeingEdited(movement);
    };

    const editMovement = (movementBeingEdited: Movement) => {
        setMovements((prev) => {
            return prev.map((mov) =>
                mov.id === movementBeingEdited.id ? movementBeingEdited : mov
            );
        });
        setMovementBeingEdited(null);
    };
*/
    const [movementBeingEdited, setMovementBeingEdited] =
        useState<Movement | null>(null);

    const defineMovementToEdit = (movement: Movement) => {
        setMovementBeingEdited(movement);
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

    const removeMovement = () => {
        console.log("removeMovement");
    };

    const editMovement = () => {
        console.log("editMovement");
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Personal Finances</h1>
            <MovementForm
                movementToEdit={movementBeingEdited}
                onAddMovement={addMovement}
                onEditMovement={editMovement}
            />
            <MovementList
                onRemoveMovement={removeMovement}
                onEditMovement={defineMovementToEdit}
                registerCreateMovement={(fn) => {
                    createMovementRef.current = fn;
                }}
            />
        </div>
    );
}

export default App;
