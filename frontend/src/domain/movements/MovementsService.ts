import type { HttpRequestHandler } from "../../infrastructure/HttpRequestHandler";
import type { ServiceResult } from "../common/ServiceResult";

import {
    DEFAULT_ERROR_MESSAGE,
    ERROR_TYPES,
} from "../../helpers/common/errors";
import { HTTP_STATUS } from "../../helpers/common/httpStatusCodes";
import { START_CURRENT_YEAR, END_CURRENT_YEAR } from "../../common/constants";
import type { Movement, MovementFilter, NewMovement } from "./types";
import { CATEGORY_TYPE } from "../categories/types";

import { getMovementsFilter } from "../../mappers/movements/movementsFilterMapper";
import { mapEditMovementRequest } from "../../mappers/movements/mapEditMovementRequest";
import { mapMovementsResponse } from "../../mappers/movements/mapMovementsResponse";
import { mapNewMovementRequest } from "../../mappers/movements/mapNewMovementRequest";
import type { BackendMovement } from "../../mappers/movements/types";

export class MovementsService {
    private requestHandler: HttpRequestHandler;
    private endpoint = "movements";

    constructor(requestHandler: HttpRequestHandler) {
        this.requestHandler = requestHandler;
    }

    async getMovements(
        filters: MovementFilter,
    ): Promise<ServiceResult<Movement[]>> {
        // Validar los filtros enviados
        const filtersToSend = { ...filters };
        if (
            filtersToSend.startDate === undefined &&
            filtersToSend.endDate === undefined
        ) {
            filtersToSend.startDate =
                START_CURRENT_YEAR.toISOString().split("T")[0];
            filtersToSend.endDate =
                END_CURRENT_YEAR.toISOString().split("T")[0];
        } else if (
            filtersToSend.startDate !== undefined &&
            filtersToSend.endDate === undefined
        ) {
            return {
                success: false,
                error: {
                    error: ERROR_TYPES.VALIDATION,
                    message: "Invalid End Date specified",
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                },
            };
        } else if (
            filtersToSend.startDate === undefined &&
            filtersToSend.endDate !== undefined
        ) {
            return {
                success: false,
                error: {
                    error: ERROR_TYPES.VALIDATION,
                    message: "Invalid Start Date specified",
                    statusCode: HTTP_STATUS.BAD_REQUEST,
                },
            };
        }

        if (filtersToSend.categoryType !== undefined) {
            if (
                !Object.values(CATEGORY_TYPE).includes(
                    filtersToSend.categoryType,
                )
            ) {
                return {
                    success: false,
                    error: {
                        error: ERROR_TYPES.VALIDATION,
                        message: "Invalid Category Type specified",
                        statusCode: HTTP_STATUS.BAD_REQUEST,
                    },
                };
            }
        }
        const formattedFilter = getMovementsFilter(filtersToSend);
        // Generar la request
        // Obtener los resultados o el error (try catch?)
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}${formattedFilter ? "?" + formattedFilter : ""}`,
            );
            // Normalizar el resultado o error
            // Retornar el resultado normalizado
            if (response.status === HTTP_STATUS.OK) {
                const responseData = response.data as BackendMovement[];

                return {
                    success: true,
                    data: responseData.map((item) =>
                        mapMovementsResponse(item),
                    ),
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
        } catch (error) {
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
    }

    async getMovementById(id: number): Promise<ServiceResult<Movement>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}/${id}`,
            );
            if (response.status === HTTP_STATUS.OK) {
                return {
                    success: true,
                    data: mapMovementsResponse(
                        response.data as BackendMovement,
                    ),
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
        } catch (error) {
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
            if (response.status === HTTP_STATUS.CREATED) {
                return {
                    success: true,
                    data: mapMovementsResponse(
                        response.data as BackendMovement,
                    ),
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
        } catch (error) {
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
            if (response.status === HTTP_STATUS.OK) {
                return {
                    success: true,
                    data: mapMovementsResponse(
                        response.data as BackendMovement,
                    ),
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
        } catch (error) {
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
    }

    async deleteMovement(id: number): Promise<ServiceResult<void>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "DELETE",
                `${this.endpoint}/${id}`,
            );
            if (response.status === HTTP_STATUS.NO_CONTENT) {
                return {
                    success: true,
                    data: undefined,
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
        } catch (error) {
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
    }
}
