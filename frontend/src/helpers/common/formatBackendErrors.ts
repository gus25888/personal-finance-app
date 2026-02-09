import type { ApiError, BackendError } from "../../domain/common/BackendError";
import { DEFAULT_ERROR_MESSAGE } from "./errors";

const isApiError = (value: unknown): value is ApiError => {
    return (
        typeof value === "object" &&
        value !== null &&
        "message" in value &&
        Array.isArray((value as ApiError).message)
    );
};
export const formatBackendError = (error: BackendError): string => {
    const { message } = error;

    if (isApiError(message)) return message.message.join(", ");

    if (typeof message === "string") return message;

    return DEFAULT_ERROR_MESSAGE;
};
