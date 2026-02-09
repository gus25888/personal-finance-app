export type ApiError = {
    error: string;
    message: string[];
    statusCode: number;
};

export type BackendError = {
    error: string;
    message: ApiError | string;
    statusCode: number;
};
