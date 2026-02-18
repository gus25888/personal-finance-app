import type { HttpRequestHandler } from "../../infrastructure/HttpRequestHandler";

import { CATEGORY_TYPE } from "../categories/types";
import type { ServiceResult } from "../common/types";
import type { Movement, MovementFilter, NewMovement } from "./types";

import type { BackendMovement } from "../../mappers/movements/types";
import { getMovementsFilter } from "../../mappers/movements/movementsFilterMapper";
import { mapEditMovementRequest } from "../../mappers/movements/mapEditMovementRequest";
import { mapMovementsResponse } from "../../mappers/movements/mapMovementsResponse";
import { mapNewMovementRequest } from "../../mappers/movements/mapNewMovementRequest";

import {
    handleResponse,
    handleUnexpectedError,
    handleValidationError,
} from "../../infrastructure/serviceResultHandlers";

export class MovementsService {
    private requestHandler: HttpRequestHandler;
    private endpoint = "movements";

    constructor(requestHandler: HttpRequestHandler) {
        this.requestHandler = requestHandler;
    }

    private validateFilters(filters: MovementFilter) {
        if (filters.startDate !== undefined && filters.endDate === undefined) {
            return handleValidationError("Invalid End Date specified");
        } else if (
            filters.startDate === undefined &&
            filters.endDate !== undefined
        ) {
            return handleValidationError("Invalid Start Date specified");
        }

        if (filters.categoryType !== undefined) {
            if (!Object.values(CATEGORY_TYPE).includes(filters.categoryType)) {
                return handleValidationError("Invalid Category Type specified");
            }
        }
    }

    async getMovements(
        filters: MovementFilter,
    ): Promise<ServiceResult<Movement[]>> {
        this.validateFilters(filters);

        const formattedFilter = getMovementsFilter(filters);

        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}${formattedFilter ? "?" + formattedFilter : ""}`,
            );
            return handleResponse<BackendMovement[], Movement[]>(
                response,
                (items) => items.map(mapMovementsResponse),
            );
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }

    async getMovementById(id: number): Promise<ServiceResult<Movement>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}/${id}`,
            );
            return handleResponse<BackendMovement, Movement>(
                response,
                mapMovementsResponse,
            );
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }

    async createMovement(
        movement: NewMovement,
    ): Promise<ServiceResult<Movement>> {
        const movementToCreate = mapNewMovementRequest(movement);

        try {
            const response = await this.requestHandler.sendRequest(
                "POST",
                `${this.endpoint}`,
                movementToCreate,
            );
            return handleResponse<BackendMovement, Movement>(
                response,
                mapMovementsResponse,
            );
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }

    async updateMovement(
        id: number,
        movementChanges: Partial<Movement>,
    ): Promise<ServiceResult<Movement>> {
        const movementToUpdate = mapEditMovementRequest(movementChanges);

        try {
            const response = await this.requestHandler.sendRequest(
                "PATCH",
                `${this.endpoint}/${id}`,
                movementToUpdate,
            );

            return handleResponse<BackendMovement, Movement>(
                response,
                mapMovementsResponse,
            );
        } catch (error) {
            return handleUnexpectedError(error);
        }
    }

    async deleteMovement(id: number): Promise<ServiceResult<void>> {
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
