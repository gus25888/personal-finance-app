import "./App.css";

import { useState, type JSX } from "react";

import type { Movement, NewMovement } from "./types";
import MovementForm from "./components/MovementForm";
import MovementList from "./components/MovementList";

function App(): JSX.Element {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [nextId, setNextId] = useState(1);

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

    console.log(movements);

    return (
        <div className="app-container">
            <h1 className="app-title">Personal Finances</h1>
            <MovementForm onAddMovement={addMovement} />
            <MovementList
                movements={movements}
                onRemoveMovement={removeMovement}
            />
        </div>
    );
}

export default App;
