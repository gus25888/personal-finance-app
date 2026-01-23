import type { HttpRequestHandler } from "../../infrastructure/HttpRequestHandler";
import type { ServiceResult } from "../common/ServiceResult";

import { START_CURRENT_YEAR, END_CURRENT_YEAR } from "../../common/constants";
import { CATEGORY_TYPE, type Movement, type MovementFilter } from "./types";
import { getMovementsFilter } from "../../mappers/movements/movementsFilterMapper";
import { mapMovementsResponse } from "../../mappers/movements/mapMovementsResponse";
import type { BackendMovement } from "../../mappers/movements/types";
import type { NewMovement } from "../../types";
import { mapNewMovementRequest } from "../../mappers/movements/mapNewMovementRequest";

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
                error: "Invalid End Date specified",
            };
        } else if (
            filtersToSend.startDate === undefined &&
            filtersToSend.endDate !== undefined
        ) {
            return {
                success: false,
                error: "Invalid Start Date specified",
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
                    error: "Invalid Category Type specified",
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
            if (response.status === 200) {
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
                    error: response.data as string,
                };
            }
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    error: error.message,
                };
            } else {
                return {
                    success: false,
                    error: "Ha ocurrido un problema en la solicitud",
                };
            }
        }
    }

    async getMovementById(id: number): Promise<ServiceResult<Movement>> {
        try {
            const response = await this.requestHandler.sendRequest(
                "GET",
                `${this.endpoint}/${id}`,
            );
            if (response.status === 200) {
                return {
                    success: true,
                    data: mapMovementsResponse(
                        response.data as BackendMovement,
                    ),
                };
            } else {
                return {
                    success: false,
                    error: response.data as string,
                };
            }
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    error: error.message,
                };
            } else {
                return {
                    success: false,
                    error: "Ha ocurrido un problema en la solicitud",
                };
            }
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
            if (response.status === 201) {
                return {
                    success: true,
                    data: mapMovementsResponse(
                        response.data as BackendMovement,
                    ),
                };
            } else {
                return {
                    success: false,
                    error: response.data as string,
                };
            }
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    error: error.message,
                };
            } else {
                return {
                    success: false,
                    error: "Ha ocurrido un problema en la solicitud",
                };
            }
        }
    }
}
