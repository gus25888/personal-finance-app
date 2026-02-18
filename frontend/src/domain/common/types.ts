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

export type ServiceResult<T> =
    | { success: true; data: T }
    | { success: false; error: BackendError };
