import type { BackendError } from "../../domain/common/BackendError";

export const formatBackendError = (error: BackendError) => {
    return Array.isArray(error.message)
        ? error.message.join(", ")
        : error.message;
};
