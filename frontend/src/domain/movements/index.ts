import { HttpRequestHandler } from "../../infrastructure/HttpRequestHandler";
import { MovementsService } from "./MovementsService";

const requestHandler: HttpRequestHandler = new HttpRequestHandler();
const movementsServiceInstance: MovementsService = new MovementsService(
    requestHandler,
);

export const movementsService = movementsServiceInstance;
