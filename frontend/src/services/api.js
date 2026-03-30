// Axios configuration for making API requests
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api/v1";

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
        const requestUrl = error.config?.url || "";
        const isAuthRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register");
        const hasToken = Boolean(localStorage.getItem("token"));

        if (error.response?.status === 401 && hasToken && !isAuthRequest) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

// Auth endpoints
export const authAPI = {
    register: async (email, password) => {
        const response = await api.post("/auth/register", { email, password });

        return {
            ...response,
            data: {
                token: response.data.token,
                user: {
                    id: response.data.id,
                    email: response.data.email,
                    name: response.data.name || "",
                    role: response.data.role,
                },
            },
        };
    },

    login: (email, password) =>
        api.post("/auth/login", {email, password}),
};

// User endpoints
export const userAPI = {
    getAll: () => api.get("/users"),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    updatePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
    delete: (id) => api.delete(`/users/${id}`),
};

export const routinesAPI = {
    getAll: () => api.get("/routines"),
    getMine: () => api.get("/routines/my"),
    create: (routineData) => api.post("/routines", routineData),
    update: (id, routineData) => api.put(`/routines/${id}`, routineData),
};

export const routineTemplatesAPI = {
    getAll: () => api.get("/routine-templates"),
    create: (templateData) => api.post("/routine-templates", templateData),
    update: (id, templateData) => api.put(`/routine-templates/${id}`, templateData),
    remove: (id) => api.delete(`/routine-templates/${id}`),
    clone: (id, name) => api.post(`/routine-templates/${id}/clone`, { name }),
    assign: (id, assignmentData) => api.post(`/routine-templates/${id}/assign`, assignmentData),
};

export const exercisesAPI = {
    getAll: (params = {}) => api.get("/exercises", { params }),
    getPaged: (params = {}) => api.get("/exercises/paged", { params }),
    create: (exerciseData) => api.post("/exercises", exerciseData),
    update: (id, exerciseData) => api.put(`/exercises/${id}`, exerciseData),
    remove: (id) => api.delete(`/exercises/${id}`),
};

export const nutritionPlansAPI = {
    getAll: () => api.get("/nutrition-plans"),
    getMine: () => api.get("/nutrition-plans/my"),
    create: (planData) => api.post("/nutrition-plans", planData),
    update: (id, planData) => api.put(`/nutrition-plans/${id}`, planData),
};

export const nutritionTemplatesAPI = {
    getAll: () => api.get("/nutrition-templates"),
    create: (templateData) => api.post("/nutrition-templates", templateData),
    update: (id, templateData) => api.put(`/nutrition-templates/${id}`, templateData),
    remove: (id) => api.delete(`/nutrition-templates/${id}`),
    assign: (id, assignmentData) => api.post(`/nutrition-templates/${id}/assign`, assignmentData),
};

export const billingSubscriptionsAPI = {
    getMine: () => api.get("/billing/subscriptions/me"),
    startCheckout: (payload = {}) => api.post("/billing/subscriptions/checkout", payload),
};

export default api;
