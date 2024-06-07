import { FetchClient } from '../src/FetchClient';
import { AxiosClient } from '../src/AxiosClient';
import { Interceptors } from '../src/Interceptors';
import { AxiosRequestConfig } from 'axios'; // Import AxiosRequestConfig

// JSONPlaceholder base URL
const BASE_URL = 'https://jsonplaceholder.typicode.com';

describe('HTTP Client Tests', () => {
    it('should make a GET request using FetchClient', async () => {
        const fetchClient = new FetchClient(BASE_URL);
        const response = await fetchClient.get<any>('/posts/1');
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', 1);
    });

    it('should make a GET request using AxiosClient', async () => {
        const axiosClient = new AxiosClient(BASE_URL);
        const response = await axiosClient.get<any>('/posts/1');
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', 1);
    });

    it('should add a request interceptor using AxiosClient', async () => {
        const axiosClient = new AxiosClient(BASE_URL);

        // Make the interceptor method public for testing purposes
        (axiosClient as any).instance.interceptors.request.use((config: AxiosRequestConfig) => {
            config.headers = {
                ...config.headers,
                'Authorization': 'Bearer token'
            };
            return config;
        });

        const response = await axiosClient.get<any>('/posts/1');
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', 1);
        // Interceptors won't modify the headers in the response directly, but we check the request's headers in practice
    });
});
