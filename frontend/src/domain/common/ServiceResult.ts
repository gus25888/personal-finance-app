import type { BackendError } from "./BackendError";

export type ServiceResult<T> =
    | { success: true; data: T }
    | { success: false; error: BackendError };
