import { handleNetworkError, requestInterceptor, responseInterceptor, setTokenGetter } from './ResponseInterceptor';
import { checkResponseJson } from './ResponseJsonChecker';

import { useAuthStore } from '@/core/store/authStore';

const TIME_OUT = 60000;
const IS_DEBUG = import.meta.env.DEV;
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestConfig {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    requiresAuth?: boolean;
}

// ---- NetworkModule (Singleton) ----
class NetworkModule {
    private timeOut: number;

    constructor() {
        this.timeOut = TIME_OUT;

        if (IS_DEBUG) {
            console.log('[NetworkModule] Base URL:', BASE_URL);
        }

        // Hubungkan langsung ke store kita (RAM + Storage)
        setTokenGetter(() => {
            return useAuthStore.getState().token || '';
        });
    }

    private get baseUrl(): string {
        return BASE_URL;
    }

    async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        // Handle FormData vs JSON body
        const isFormData = config.body instanceof FormData;
        const headers: Record<string, string> = {
            ...config.headers,
        };

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        headers['Accept'] = 'application/json';
        headers['ngrok-skip-browser-warning'] = '69420'; // Optional : Bypass ngrok

        // 1. Request Interceptor: inject auth token
        const finalHeaders = requestInterceptor(
            headers,
            config.requiresAuth ?? false,
        );

        // 2. Prepare body
        let requestBody: any = config.body;
        if (!isFormData && config.body) {
            requestBody = JSON.stringify(config.body);
        }

        // 3. Logging
        if (IS_DEBUG) {
            console.log(`[HTTP ${config.method || 'GET'}] ${url}`);
            console.log('[HTTP Headers]', finalHeaders);
            if (config.body) {
                console.log('[HTTP Body]', isFormData ? 'FormData (files attached)' : config.body);
            }
        }

        // 4. Native Fetch Request (support FormData natively)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeOut);

        let response: Response;
        try {
            response = await fetch(url, {
                method: config.method || 'GET',
                headers: finalHeaders,
                body: requestBody,
                signal: controller.signal,
            });
        } catch (error) {
            console.error('[HTTP Fetch Error]', error);
            handleNetworkError(error);
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }

        // 5. Debug logging response
        if (IS_DEBUG) {
            console.log(`[HTTP Response] - ${response.status} ${url}`);
        }

        // 6. Response Interceptor: HTTP status
        responseInterceptor(response);

        // 7. Parse JSON
        const json = await checkResponseJson<T>(response);

        // 8. Handle backend error response (success: false)
        if (json && typeof json === 'object' && 'success' in json) {
            const backendResponse = json as any;
            if (backendResponse.success === false && backendResponse.message) {
                throw new Error(backendResponse.message);
            }
        }

        return json;
    }
}

// Singleton instance
export const networkModule = new NetworkModule(BASE_URL);