import type { ServiceResult } from "../domain/common/types";
import { ERROR_TYPES, DEFAULT_ERROR_MESSAGE } from "../helpers/common/errors";
import type { HttpResponse } from "./HttpRequestHandler";
import { isSuccessStatus, HTTP_STATUS } from "./httpStatusCodes";

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
        return {
            success: false,
            error: {
                error: ERROR_TYPES.REQUEST,
                message: response.data as string,
                statusCode: response.status,
            },
        };
    }
}

export function handleUnexpectedError(error: unknown): ServiceResult<never> {
    return {
        success: false,
        error: {
            error: ERROR_TYPES.REQUEST,
            message:
                error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
            statusCode: HTTP_STATUS.INTERNAL_ERROR,
        },
    };
}

export function handleValidationError(message: string): ServiceResult<never> {
    return {
        success: false,
        error: {
            error: ERROR_TYPES.VALIDATION,
            message,
            statusCode: HTTP_STATUS.BAD_REQUEST,
        },
    };
}

export function handleApplicationError(message: string): ServiceResult<never> {
    return {
        success: false,
        error: {
            error: ERROR_TYPES.APPLICATION,
            message,
            statusCode: HTTP_STATUS.INTERNAL_ERROR,
        },
    };
}
