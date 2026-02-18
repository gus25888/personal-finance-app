import type { HttpRequestHandler } from "../../infrastructure/HttpRequestHandler";

import type { ServiceResult } from "../common/types";

import type { Category, NewCategory } from "./types";
import { mapEditCategoryRequest } from "../../mappers/categories/mapEditCategoryRequest";
import {
    handleResponse,
    handleUnexpectedError,
} from "../../infrastructure/serviceResultHandlers";

export class CategoriesService {
    private requestHandler: HttpRequestHandler;
    private endpoint = "categories";

    constructor(requestHandler: HttpRequestHandler) {
        this.requestHandler = requestHandler;
    }

    async getCategories(): Promise<ServiceResult<Category[]>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}`,
            );

            return handleResponse<Category[]>(response);
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }

    async getCategoryById(id: number): Promise<ServiceResult<Category>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}/${id}`,
            );

            return handleResponse<Category>(response);
        } catch (error) {
            return handleUnexpectedError(error);
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

            return handleResponse<Category>(response);
        } catch (error) {
            return handleUnexpectedError(error);
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
            return handleResponse<Category>(response);
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }

    async deleteCategory(id: number): Promise<ServiceResult<void>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "DELETE",
                `${this.endpoint}/${id}`,
            );
            return handleResponse<void>(response);
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }
}
