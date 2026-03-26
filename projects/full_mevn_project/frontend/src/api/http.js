import axios from 'axios'

export const http = axios.create({
  baseURL: 'https://ics4u-a-25-26-full-mevn-project-backend.onrender.com',
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
