import type {
    HttpRequestHandler,
    HttpResponse,
} from "../../infrastructure/HttpRequestHandler";
import type { ServiceResult } from "../common/ServiceResult";

import {
    DEFAULT_ERROR_MESSAGE,
    ERROR_TYPES,
} from "../../helpers/common/errors";
import { HTTP_STATUS } from "../../helpers/common/httpStatusCodes";

import type { Category } from "./types";

export class CategoriesService {
    private requestHandler: HttpRequestHandler;
    private endpoint = "categories";

    constructor(requestHandler: HttpRequestHandler) {
        this.requestHandler = requestHandler;
    }

    private handleResponse<T>(response: HttpResponse): ServiceResult<T> {
        if (response.status === HTTP_STATUS.OK) {
            return {
                success: true,
                data: response.data as T,
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

    private handleUnexpectedError(error: unknown): ServiceResult<never> {
        return {
            success: false,
            error: {
                error: ERROR_TYPES.REQUEST,
                message:
                    error instanceof Error
                        ? error.message
                        : DEFAULT_ERROR_MESSAGE,
                statusCode: HTTP_STATUS.INTERNAL_ERROR,
            },
        };
    }

    async getCategories(): Promise<ServiceResult<Category[]>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}`,
            );

            return this.handleResponse<Category[]>(response);
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }
}
