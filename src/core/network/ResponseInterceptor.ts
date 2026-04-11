import { ErrorMessage } from "../common/Constant";

let getToken: (() => string) | null = null;

export const setTokenGetter = (getter: () => string) => {
    getToken = getter;
};

// ---- Request Interceptor: inject headers sebelum request ----
export const requestInterceptor = (
    headers: Record<string, string>,
    requiresAuth: boolean,
): Record<string, string> => {
    const newHeaders = { ...headers };

    if (requiresAuth && getToken) {
        const token = getToken();
        newHeaders['Authorization'] = `Bearer ${token}`;
    }

    return newHeaders;
};

// ---- Network Error Handler: handle error saat fetch (sebelum dapet response) ----
export const handleNetworkError = (error: unknown): never => {
    if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error(ErrorMessage.NO_CONNECTION);
    }

    if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(ErrorMessage.REQUEST_TIME_OUT);
    }

    throw new Error('Something went wrong');
};

// ---- Response Interceptor: cek HTTP status code ----
export const responseInterceptor = (response: Response): void => {
    const code = response.status;

    if (code >= 200 && code <= 299) {
        return;
    }

    switch (code) {
        case 400: {
            throw new Error(ErrorMessage.BAD_REQUEST);
        }
        case 401: {
            // Unauthorized - redirect to login
            throw new Error('Unauthorized. Please login again.');
        }
        case 403: {
            throw new Error('Access forbidden. You do not have permission.');
        }
        case 404: {
            throw new Error('Resource not found.');
        }
        default: {
            if (code >= 500 && code <= 599) {
                throw new Error(ErrorMessage.INTERNAL_SERVER_ERROR);
            }
            throw new Error(`Request failed with status ${code}`);
        }
    }
};