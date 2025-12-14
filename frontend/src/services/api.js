// Axios configuration for making API requests
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptors
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

// Auth endpoints
export const authAPI = {
    register: (email, password) =>
        api.post("/auth/register", {email, password}),

    login: (email, password) =>
        api.post("/auth/login", {email, password}),
};

// User endpoints
export const userAPI = {
    getAll: () => api.get("/users"),
    getById: (id) => api.get(`/users/${id}`),
    update: (id) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
}

export default api;
