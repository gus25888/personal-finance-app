import "./App.css";

import { useState, type JSX } from "react";

import type { Movement, NewMovement } from "./types";
import MovementForm from "./components/MovementForm";

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

    console.log(movements);

    return (
        <>
            <h1>Personal Finances</h1>
            <p>Enter a new Movement:</p>
            <MovementForm onAddMovement={addMovement} />
        </>
    );
}

export default App;
