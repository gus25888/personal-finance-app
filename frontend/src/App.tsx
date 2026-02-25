import "./App.css";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";

import { formatBackendError } from "./infrastructure/formatBackendErrors";
import { handleApplicationError } from "./infrastructure/serviceResultHandlers";

import NotificationBanner from "./components/common/NotificationBanner";
import Modal from "./components/common/Modal";
import MovementForm from "./components/movements/MovementForm";
import MovementList from "./components/movements/MovementList";
import CategoriesModal from "./components/categories/CategoriesModal";

import type { ServiceResult } from "./domain/common/types";
import type { Movement, NewMovement } from "./domain/movements/types";
import type { Category, NewCategory } from "./domain/categories/types";
import { categoriesService } from "./domain/categories";

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

    const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
    const openCategoriesModal = () => setIsCategoriesModalOpen(true);
    const closeCategoriesModal = () => setIsCategoriesModalOpen(false);

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

    const addCategory = useCallback(
        async (category: NewCategory): Promise<ServiceResult<Category>> => {
            const result = await categoriesService.createCategory(category);

            if (!result.success) {
                return {
                    success: false,
                    error: result.error,
                };
            }

            const categoryCreated = result.data;

            setCategories((prevState) => [...prevState, categoryCreated]);

            return {
                success: true,
                data: categoryCreated,
            };
        },
        [],
    );

    const removeCategory = async (id: number): Promise<ServiceResult<void>> => {
        const result = await categoriesService.deleteCategory(id);

        if (!result.success) {
            onShowNotification({
                type: NOTIFICATION_TYPES.ERROR,
                message: formatBackendError(result.error),
            });

            return {
                success: false,
                error: result.error,
            };
        }

        setCategories((prevState) =>
            prevState.filter((prev) => prev.id !== id),
        );

        onShowNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            message: "Category deleted successfully",
        });

        return {
            success: true,
            data: undefined,
        };
    };

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
            </main>
            <Modal
                isOpen={isCategoriesModalOpen}
                onClose={closeCategoriesModal}
                children={
                    <CategoriesModal
                        categories={categories}
                        onNotify={onShowNotification}
                        onCreateCategory={addCategory}
                        onEditCategory={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        onDeleteCategory={removeCategory}
                    />
                }
            />
        </div>
    );
}

export default App;
