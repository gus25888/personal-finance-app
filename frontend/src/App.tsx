import "./App.css";

import { useEffect, useRef, useState, type JSX } from "react";

import type { Movement, NewMovement } from "./domain/movements/types";

import NotificationBanner from "./components/NotificationBanner";
import MovementForm from "./components/MovementForm";
import MovementList from "./components/MovementList";

import type { ServiceResult } from "./domain/common/ServiceResult";

import { HTTP_STATUS } from "./helpers/common/httpStatusCodes";
import { ERROR_TYPES } from "./helpers/common/errors";
import type { Category } from "./domain/categories/types";
import { categoriesService } from "./domain/categories";
import { formatBackendError } from "./helpers/common/formatBackendErrors";
import {
    NOTIFICATION_TYPES,
    type NotificationData,
} from "./types/notification";

function App(): JSX.Element {
    const [notification, setNotification] = useState<NotificationData | null>(
        null,
    );
    const onShowNotification = (newNotification: NotificationData) => {
        setNotification(newNotification);
    };
    const onCloseNotification = () => setNotification(null);

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const result = await categoriesService.getCategories();

            if (result.success) {
                setCategories(result.data ?? []);
            } else {
                onShowNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: formatBackendError(result.error),
                });
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

    /*
        Uso de key en MovementForm:

        key, es uno de los Intrinsic Attributes de los componentes de React.
        En el Form, permite generar una distinción en las props enviadas:
        Si movementBeingEdited NO es null, se enviará el valor de su ID,
        lo cual permite indicar al Form que debe refrescarse.
        Dentro del Form se evalúa siempre el valor de la prop "movementBeingEdited"
        y se asigna su valor, en caso de NO ser null, y se deja en blanco el formulario,
        en caso de sí estarlo.

        Con esto se evita tener que realizar refrescos internos en el componente.
    */
    return (
        <div className="app-container">
            <h1 className="app-title">Personal Finances</h1>
            {notification && (
                <NotificationBanner
                    notification={notification}
                    onClose={onCloseNotification}
                />
            )}
            <MovementForm
                key={movementBeingEdited?.id ?? "new"}
                movementToEdit={movementBeingEdited}
                onAddMovement={addMovement}
                onEditMovement={editMovement}
                onClearEditMovement={clearMovementToEdit}
                onNotify={onShowNotification}
                categories={categories}
            />
            <MovementList
                onNotify={onShowNotification}
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
