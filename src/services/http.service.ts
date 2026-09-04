import Axios, { type AxiosRequestConfig, type Method } from 'axios'

// for developement set VITE_API_URL in env to http://localhost:3000/api/
const BASE_URL =  import.meta.env.VITE_API_URL || 'https://api.tiranlasry.com/api/' ;

    
// const BASE_URL = 'https://api.tiranlasry.com/api/' 
// const BASE_URL = 'https://lighting-store-backend-production.up.railway.app/api/' 


const axios = Axios.create({ withCredentials: true, baseURL: BASE_URL })
// const axiosNoIntercept = Axios.create({ withCredentials: true, baseURL: BASE_URL })

export const httpService = {
    get<TResponse, TData = undefined>(endpoint: string, data?: TData): Promise<TResponse> {
        return ajax<TResponse, TData>(endpoint, 'GET', data)
    },
    post<TResponse, TData = undefined>(endpoint: string, data: TData): Promise<TResponse> {
        return ajax<TResponse, TData>(endpoint, 'POST', data)
    },
    put<TResponse, TData = undefined>(endpoint: string, data: TData): Promise<TResponse> {
        return ajax<TResponse, TData>(endpoint, 'PUT', data)
    },
    delete<TResponse, TData = undefined>(endpoint: string, data?: TData): Promise<TResponse> {
        return ajax<TResponse, TData>(endpoint, 'DELETE', data)
    },
    async download(endpoint: string): Promise<Blob> {
        const options: AxiosRequestConfig = { 
            url: endpoint, 
            method: 'GET', 
            responseType: 'blob', 
            withCredentials: true 
        }
        try {
            const res = await axios(options)
            return res.data
        } catch (err) {
            console.log(`Had Issues downloading from the backend, endpoint: ${endpoint}`)
            console.dir(err)
            throw err
        }
    }
}

async function ajax<TResponse, TData = undefined>(endpoint: string, method: Method = 'GET', data: TData | null = null): Promise<TResponse> {
    const url = endpoint
    const params = (method === 'GET') ? data : null

    const options: AxiosRequestConfig = { url, method, data, params, withCredentials: true }

    try {
        const res = await axios(options)
        return res.data
    } catch (err) {
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(err)
        // if (err.response && err.response.status === 401) {
        //     sessionStorage.clear()
        //     window.location.assign('/')
        // }
        throw err
    }
}

type RefreshSubscriber = {
    resolve: (value: unknown) => void
    reject: (reason?: unknown) => void
}

let isRefreshing = false
let refreshSubscribers: RefreshSubscriber[] = []

function onRefreshed() {
    refreshSubscribers.forEach(sub => sub.resolve(true))
    refreshSubscribers = []
}

function onRefreshFailed(error: unknown) {
    refreshSubscribers.forEach(sub => sub.reject(error))
    refreshSubscribers = []
}

function addRefreshSubscriber(subscriber: RefreshSubscriber) {
    refreshSubscribers.push(subscriber)
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        let status = error.response?.status;

        // If the response is a blob, it might be a JSON error hidden in a blob
        if (error.response?.data instanceof Blob && error.response.data.type === 'application/json') {
            try {
                const text = await error.response.data.text();
                const data = JSON.parse(text);
                if (data.status) status = data.status;
            } catch (err) {
                console.error('Failed to parse error blob as JSON', err);
            }
        }

        if (status === 401 && !originalRequest._retry) {
            // Check if this is a download request or if we should skip forced logout
            const isDownload = originalRequest.responseType === 'blob' || originalRequest.url?.includes('export/')

            if (originalRequest.url?.includes('/auth/refresh-token')) {
                // Refresh token endpoint itself failed
                isRefreshing = false
                onRefreshFailed(error)
                if (!isDownload && status === 401) {
                    localStorage.removeItem('loggedinUser')
                    window.dispatchEvent(new Event('user-changed'))
                    window.location.assign('/login')
                }
                return Promise.reject(error);
            }

            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    addRefreshSubscriber({
                        resolve: () => resolve(axios(originalRequest)),
                        reject: (err) => reject(err)
                    })
                })
            }

            isRefreshing = true

            // Access Token expired. Attempting to refresh...
            try {
                await _renewAccessToken();
                isRefreshing = false
                onRefreshed()
                // Token refreshed. Retrying original request...
                return axios(originalRequest);
            } catch (refreshErr: any) {
                isRefreshing = false
                onRefreshFailed(refreshErr)

                // Only force logout if the backend explicitly rejected the session with 401.
                // Transient network errors or timeouts should NOT log the user out!
                const isSessionExpired = refreshErr.response?.status === 401;

                if (!isDownload && isSessionExpired) {
                    localStorage.removeItem('loggedinUser')
                    window.dispatchEvent(new Event('user-changed'))
                    window.location.assign('/login')
                } else if (isDownload && isSessionExpired) {
                    alert('Mobile Safari security settings are blocking the download. Please ensure "Prevent Cross-Site Tracking" is disabled in Settings > Safari, or try a different browser.')
                }
                return Promise.reject(refreshErr);
            }
        }
        return Promise.reject(error);
    }
);


async function _renewAccessToken() {
    const res = await axios.post('auth/refresh-token')
    if (res.data && typeof res.data === 'object' && res.data._id) {
        localStorage.setItem('loggedinUser', JSON.stringify(res.data))
        window.dispatchEvent(new Event('user-changed'))
    }
}