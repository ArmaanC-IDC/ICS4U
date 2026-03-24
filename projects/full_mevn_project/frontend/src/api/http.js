import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// Optional: log errors in one place
http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API error:', err?.response?.data || err.message)
    return Promise.reject(err)
  }
)
