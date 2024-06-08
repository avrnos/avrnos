//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

import { HttpClient, RequestConfig, HttpResponse } from './HttpClient';

export class FetchClient extends HttpClient {
    async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('GET', url, null, config);
    }

    async post<T>(url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('POST', url, data, config);
    }

    async put<T>(url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('PUT', url, data, config);
    }

    async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('DELETE', url, null, config);
    }

    private async request<T>(method: string, url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        const mergedConfig = this.mergeConfig(config);
        const response = await fetch(`${this.baseUrl}${url}`, {
            method,
            headers: mergedConfig.headers,
            body: data ? JSON.stringify(data) : null,
        });

        const responseData = await response.json();
        return {
            status: response.status,
            data: responseData,
            headers: this.parseHeaders(response.headers),
        };
    }

    private parseHeaders(headers: Headers): Record<string, string> {
        const parsed: Record<string, string> = {};
        headers.forEach((value, key) => {
            parsed[key] = value;
        });
        return parsed;
    }
}
