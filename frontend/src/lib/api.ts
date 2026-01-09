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
    if (!error.response) {
      return Promise.reject(error)
    }             

    const status = error.response.status
    const url = originalRequest.url

    const isAuthRoute =
    url.includes("/users/login") ||
    url.includes("/users/register") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/google")

    if (isAuthRoute) {
      return Promise.reject(error)
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await api.post("/auth/refresh")
        const newAccessToken = res.data.accessToken

        setAccessToken(newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        setAccessToken(null)
        window.location.href = "/signin"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
