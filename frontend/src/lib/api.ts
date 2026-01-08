import axios from "axios"

const TOKEN_KEY = "accessToken"

// Initialize token from localStorage
const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

let accessToken: string | null = getStoredToken()

export const setAccessToken = (token: string | null) => {
  accessToken = token
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }
}

export const getAccessToken = (): string | null => {
  // Return in-memory token if available, otherwise check localStorage
  return accessToken || getStoredToken()
}

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // REQUIRED for refresh cookie
})

/* Attach access token */
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

/* Handle token expiry */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const res = await api.post("/auth/refresh")
      setAccessToken(res.data.accessToken)

      originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
      return api(originalRequest)
    }

    return Promise.reject(error)
  }
)

export default api
