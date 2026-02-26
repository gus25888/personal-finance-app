import type { BackendError, ServiceResult } from "../domain/common/types";
import { DEFAULT_ERROR_MESSAGE } from "../helpers/common/errors";
import type { HttpResponse } from "./HttpRequestHandler";
import { isSuccessStatus } from "./httpStatusCodes";

export function handleResponse<TIn, TOut = TIn>(
    response: HttpResponse,
    transformFn?: (data: TIn) => TOut,
): ServiceResult<TOut> {
    if (isSuccessStatus(response.status)) {
        const rawData = response.data as TIn;
        return {
            success: true,
            data: transformFn
                ? transformFn(rawData)
                : (rawData as unknown as TOut),
        };
    } else {
        const { message } = response.data as BackendError;
        return {
            success: false,
            error: message,
        };
    }
}

export function handleUnexpectedError(error: unknown): ServiceResult<never> {
    return {
        success: false,
        error: error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
    };
}

export function handleValidationError(message: string): ServiceResult<never> {
    return {
        success: false,
        error: message,
    };
}

export function handleApplicationError(message: string): ServiceResult<never> {
    return {
        success: false,
        error: message,
    };
}
