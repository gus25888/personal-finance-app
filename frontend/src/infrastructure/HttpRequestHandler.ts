import { apiBaseUrl } from "../config/api";
import { HTTP_STATUS } from "./httpStatusCodes";

export interface HttpResponse {
    data?: unknown;
    status: number;
}

interface FetchHeaders {
    [key: string]: string;
}

interface FetchOptions {
    headers: FetchHeaders;
    method: string;
    body?: string;
}

export class HttpRequestHandler {
    /**
     *
     * @param httpMethod string
     * @param endpoint string: Endpoint name
     * @param payload Body of the request
     * @returns response of type HttpResponse
     */
    async sendRequest(
        httpMethod: string,
        endpoint: string,
        payload?: unknown,
    ): Promise<HttpResponse> {
        let serializedPayload: string;
        const url: string = `${apiBaseUrl}/${endpoint}`;

        const options: FetchOptions = {
            headers: { "Content-Type": "application/json" },
            method: httpMethod,
        };

        // Solo en caso de que haya un payload, se puede agregar un "body" a la request.
        if (payload !== undefined && payload !== null) {
            serializedPayload = JSON.stringify(payload);
            // Además, solo si la request lo requiere, por su método.
            if (httpMethod === "POST" || httpMethod === "PATCH") {
                options.body = serializedPayload;
            }
        }

        const response = await fetch(url, options);

        if (response.status === HTTP_STATUS.NO_CONTENT) {
            return { status: response.status, data: null };
        }

        try {
            const jsonResponse = await response.json();

            return { status: response.status, data: jsonResponse };
        } catch (error) {
            console.log(error);
            return { status: response.status };
        }
    }
}
