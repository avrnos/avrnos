//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClient, RequestConfig, HttpResponse } from './HttpClient';

export class AxiosClient extends HttpClient {
    private instance: AxiosInstance;

    constructor(baseUrl: string, defaultConfig: RequestConfig = {}) {
        super(baseUrl, defaultConfig);
        this.instance = axios.create({
            baseURL: this.baseUrl,
            headers: this.defaultConfig.headers,
            timeout: this.defaultConfig.timeout,
        });
    }

    async get<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('get', url, null, config);
    }

    async post<T>(url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('post', url, data, config);
    }

    async put<T>(url: string, data: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('put', url, data, config);
    }

    async delete<T>(url: string, config?: RequestConfig): Promise<HttpResponse<T>> {
        return this.request<T>('delete', url, null, config);
    }

    private async request<T>(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: unknown, config?: RequestConfig): Promise<HttpResponse<T>> {
        const mergedConfig = this.mergeConfig(config);
        const axiosConfig: AxiosRequestConfig = {
            method,
            url,
            data,
            headers: mergedConfig.headers,
            timeout: mergedConfig.timeout,
        };

        const response: AxiosResponse<T> = await this.instance.request(axiosConfig);

        return {
            status: response.status,
            data: response.data,
            headers: this.convertHeaders(response.headers),
        };
    }

    private convertHeaders(headers: Record<string, any>): Record<string, string> {
        const convertedHeaders: Record<string, string> = {};
        for (const key in headers) {
            if (typeof headers[key] === 'string') {
                convertedHeaders[key] = headers[key];
            }
        }
        return convertedHeaders;
    }
}
