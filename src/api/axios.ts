import axios, { InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1/Integration/odata/Vote/Vote.',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  auth: {
    username: 'Administrator',
    password: '11',
  },
})

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ [${error.response?.status}] ${error.config?.url}`, error.response?.data)
    return Promise.reject(error)
  }
)

export default api