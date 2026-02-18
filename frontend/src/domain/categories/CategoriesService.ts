import type {
    HttpRequestHandler,
    HttpResponse,
} from "../../infrastructure/HttpRequestHandler";
import type { ServiceResult } from "../common/ServiceResult";

import {
    DEFAULT_ERROR_MESSAGE,
    ERROR_TYPES,
} from "../../helpers/common/errors";
import {
    HTTP_STATUS,
    isSuccessStatus,
} from "../../helpers/common/httpStatusCodes";

import type { Category, NewCategory } from "./types";
import { mapEditCategoryRequest } from "../../mappers/categories/mapEditCategoryRequest";

export class CategoriesService {
    private requestHandler: HttpRequestHandler;
    private endpoint = "categories";

    constructor(requestHandler: HttpRequestHandler) {
        this.requestHandler = requestHandler;
    }

    // TODO: Refactorizar estos métodos handle para que sean usados por los dos Services.
    private handleResponse<T>(response: HttpResponse): ServiceResult<T> {
        if (isSuccessStatus(response.status)) {
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

    async getCategoryById(id: number): Promise<ServiceResult<Category>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}/${id}`,
            );

            return this.handleResponse<Category>(response);
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }

    async createCategory(
        category: NewCategory,
    ): Promise<ServiceResult<Category>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "POST",
                `${this.endpoint}`,
                category,
            );

            return this.handleResponse<Category>(response);
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }

    async updateCategory(
        id: number,
        categoryChanges: Partial<Category>,
    ): Promise<ServiceResult<Category>> {
        const dataToUpdate = mapEditCategoryRequest(categoryChanges);

        try {
            const response = await this.requestHandler.sendRequest(
                "PATCH",
                `${this.endpoint}/${id}`,
                dataToUpdate,
            );
            return this.handleResponse<Category>(response);
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }

    async deleteCategory(id: number): Promise<ServiceResult<void>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "DELETE",
                `${this.endpoint}/${id}`,
            );
            return this.handleResponse<void>(response);
        } catch (error) {
            return this.handleUnexpectedError(error);
        }
    }
}
