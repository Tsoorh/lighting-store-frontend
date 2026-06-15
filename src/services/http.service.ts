import Axios, { type AxiosRequestConfig, type Method } from 'axios'

// const BASE_URL = import.meta.env.PROD 
    // ? 'https://lighting-store-backend-production.up.railway.app/api/' 
    // : 'http://localhost:3000/api/'; 
    
    const BASE_URL = 'https://lighting-store-backend-production.up.railway.app/api/' 
    // const BASE_URL = '/api/' 
    // const BASE_URL = 'http://localhost:3000/api/' 

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

let isRefreshing = false
let refreshSubscribers: ((() => void))[] = []

function onRefreshed() {
    refreshSubscribers.forEach(callback => callback())
    refreshSubscribers = []
}

function addRefreshSubscriber(callback: () => void) {
    refreshSubscribers.push(callback)
}

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                //Refresh token failed or revoked. Logging out.
                isRefreshing = false
                localStorage.removeItem('loggedinUser')
                window.dispatchEvent(new Event('user-changed'))
                window.location.assign('/login')
                return Promise.reject(error);
            }

            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(() => {
                        resolve(axios(originalRequest))
                    })
                })
            }

            isRefreshing = true

            //Access Token expired. Attempting to refresh...
            try {
                await _renewAccessToken();
                isRefreshing = false
                onRefreshed()
                //Token refreshed. Retrying original request...
                return axios(originalRequest);
            } catch {
                //Failed to renew token. Logging out.
                isRefreshing = false
                localStorage.removeItem('loggedinUser')
                window.dispatchEvent(new Event('user-changed'))
                window.location.assign('/login')
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);


async function _renewAccessToken() {
    await axios.post('auth/refresh-token')
}