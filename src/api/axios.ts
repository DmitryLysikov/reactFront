import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // замени на свой URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [${response.status}] ${response.config.url}`)
    }
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      // window.location.href = '/login'
    }

    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [${error.response?.status}] ${error.config?.url}`)
    }

    return Promise.reject(error)
  }
)

export default api