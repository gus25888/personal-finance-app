import "./App.css";

import { useState, type JSX } from "react";

// import type { Movement, NewMovement } from "./types";
import type { Movement } from "./types";
import MovementForm from "./components/MovementForm";
import MovementList from "./components/MovementList";

function App(): JSX.Element {
    /*
    const [nextId, setNextId] = useState(1);
    const [movementBeingEdited, setMovementBeingEdited] =
        useState<Movement | null>(null);

    const addMovement = (movement: NewMovement) => {
        setMovements((prev) => [
            ...prev,
            {
                id: nextId,
                ...movement,
            },
        ]);
        setNextId(nextId + 1);
    };

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

    const addMovement = () => {
        console.log("addMovement");
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
                onAddMovement={addMovement}
                onEditMovement={editMovement}
                movementToEdit={movementBeingEdited}
            />
            <MovementList
                onRemoveMovement={removeMovement}
                onEditMovement={defineMovementToEdit}
            />
        </div>
    );
}

export default App;
