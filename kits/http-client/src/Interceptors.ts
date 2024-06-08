//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

import { AxiosInstance } from 'axios';

export class Interceptors {
    static addRequestInterceptor(instance: AxiosInstance, onRequest: (config: any) => any): void {
        instance.interceptors.request.use(onRequest);
    }

    static addResponseInterceptor(instance: AxiosInstance, onResponse: (response: any) => any, onError: (error: any) => any): void {
        instance.interceptors.response.use(onResponse, onError);
    }
}
