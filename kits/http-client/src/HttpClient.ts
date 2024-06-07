export interface RequestConfig {
    headers?: Record<string, string>;
    timeout?: number;
}

export interface HttpResponse<T> {
    status: number;
    data: T;
    headers: Record<string, string>;
}

export abstract class HttpClient {
    constructor(protected baseUrl: string, protected defaultConfig: RequestConfig = {}) {}

    abstract get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;
    abstract post<T>(url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
    abstract put<T>(url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>>;
    abstract delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>>;

    protected mergeConfig(config?: RequestConfig): RequestConfig {
        return { ...this.defaultConfig, ...config };
    }
}
