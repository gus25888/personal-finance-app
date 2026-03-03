import "./App.css";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";

import { handleApplicationError } from "./infrastructure/serviceResultHandlers";

import NotificationBanner from "./components/common/NotificationBanner";
import Modal from "./components/common/Modal";
import MovementForm from "./components/movements/MovementForm";
import MovementList from "./components/movements/MovementList";
import CategoriesModal from "./components/categories/CategoriesModal";

import type { ServiceResult } from "./domain/common/types";
import type { Movement, NewMovement } from "./domain/movements/types";

import {
    NOTIFICATION_TYPES,
    type NotificationData,
} from "./types/notification";
import { useCategories } from "./hooks/useCategories";
import type { Category, NewCategory } from "./domain/categories/types";

function App(): JSX.Element {
    const [notification, setNotification] = useState<NotificationData | null>(
        null,
    );
    const onShowNotification = (newNotification: NotificationData) => {
        setNotification(newNotification);
    };
    const onCloseNotification = () => setNotification(null);

    const handleServiceOperation = useCallback(
        async (
            operation: () => Promise<ServiceResult<void>>,
            showSuccessMessage: boolean = true,
        ): Promise<ServiceResult<void>> => {
            const result = await operation();
            if (result.success) {
                if (showSuccessMessage) {
                    setNotification({
                        type: NOTIFICATION_TYPES.SUCCESS,
                        message: "Process completed successfully",
                    });
                }
            } else {
                setNotification({
                    type: NOTIFICATION_TYPES.ERROR,
                    message: result.error,
                });
            }
            return result;
        },
        [],
    );

    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const openCategoriesModal = () => setIsCategoriesModalOpen(true);
    const closeCategoriesModal = () => setIsCategoriesModalOpen(false);

    const {
        categories,
        loadingCategories,
        loadCategories,
        addCategory,
        editCategory,
        removeCategory,
    } = useCategories();

    const onCreateCategory = async (category: NewCategory) =>
        handleServiceOperation(() => addCategory(category));

    const onEditCategory = async (id: number, category: Partial<Category>) =>
        handleServiceOperation(() => editCategory(id, category));

    const onDeleteCategory = async (id: number) =>
        handleServiceOperation(() => removeCategory(id));

    /*
     We intentionally trigger a notification via handleServiceOperation on initial load.
     This causes a state update inside useEffect, which is valid in this case
     because it's a controlled async side-effect (data fetching + notification).
     The ESLint rule react-hooks/set-state-in-effect is disabled here by design.
    */
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        handleServiceOperation(() => loadCategories(), false);
    }, [handleServiceOperation, loadCategories]);

    const [movementBeingEdited, setMovementBeingEdited] =
        useState<Movement | null>(null);

    const defineMovementToEdit = (movement: Movement) => {
        setMovementBeingEdited(movement);
    };
    const clearMovementToEdit = () => {
        setMovementBeingEdited(null);
    };

    const createMovementRef =
        useRef<(movement: NewMovement) => Promise<ServiceResult<void>>>(null);

    const addMovement = async (
        movement: NewMovement,
    ): Promise<ServiceResult<void>> => {
        if (!createMovementRef.current) {
            return handleApplicationError(
                "The Application is not ready to create movements",
            );
        }

        return await createMovementRef.current(movement);
    };

    const editMovementRef =
        useRef<
            (
                id: number,
                movement: Partial<Movement>,
            ) => Promise<ServiceResult<void>>
        >(null);

    const editMovement = async (
        id: number,
        movement: Partial<Movement>,
    ): Promise<ServiceResult<void>> => {
        if (!editMovementRef.current) {
            return handleApplicationError(
                "The Application is not ready to edit movements",
            );
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
            <header className="app-header">
                <h1 className="app-title">Personal Finances</h1>
                <button
                    className="categories-button"
                    onClick={openCategoriesModal}
                >
                    Categories
                </button>
                {notification && (
                    <NotificationBanner
                        notification={notification}
                        onClose={onCloseNotification}
                    />
                )}
            </header>
            <main className="app-main">
                {loadingCategories && <div>Loading...</div>}
                {!loadingCategories && (
                    <>
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
                            onHandleServiceOperation={handleServiceOperation}
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
                    </>
                )}
            </main>
            <Modal
                isOpen={isCategoriesModalOpen}
                onClose={closeCategoriesModal}
                children={
                    <CategoriesModal
                        categories={categories}
                        onNotify={onShowNotification}
                        onCreateCategory={onCreateCategory}
                        onEditCategory={onEditCategory}
                        onDeleteCategory={onDeleteCategory}
                    />
                }
            />
        </div>
    );
}

export default App;
