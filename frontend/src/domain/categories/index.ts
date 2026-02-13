import { HttpRequestHandler } from "../../infrastructure/HttpRequestHandler";
import { CategoriesService } from "./CategoriesService";

const requestHandler: HttpRequestHandler = new HttpRequestHandler();
const categoriesServiceInstance: CategoriesService = new CategoriesService(
    requestHandler,
);

export const categoriesService = categoriesServiceInstance;
