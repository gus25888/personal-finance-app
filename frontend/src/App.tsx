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

    const fetchCategories = useCallback(async () => {
        const result: ServiceResult<Category[]> = await loadCategories();

        if (!result.success) {
            setNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: result.error,
            });
        }
    }, [loadCategories]);

    const onCreateCategory = async (category: NewCategory) => {
        const result = await addCategory(category);
        if (result.success) {
            setNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                message: "Category created successfully",
            });
        } else {
            setNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: result.error,
            });
        }
        return result;
    };
    const onEditCategory = async (id: number, category: Partial<Category>) => {
        const result = await editCategory(id, category);
        if (result.success) {
            setNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                message: "Category updated successfully",
            });
        } else {
            setNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: result.error,
            });
        }
        return result;
    };

    const onDeleteCategory = async (id: number) => {
        const result = await removeCategory(id);
        if (result.success) {
            setNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                message: "Category deleted successfully",
            });
        } else {
            setNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: result.error,
            });
        }
        return result;
    };

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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
            ) => Promise<ServiceResult<Movement>>
        >(null);

    const editMovement = async (
        id: number,
        movement: Partial<Movement>,
    ): Promise<ServiceResult<Movement>> => {
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
