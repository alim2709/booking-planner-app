import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:7777/api/", // Адрес вашего API
});

// Интерсептор для добавления токена в запросы
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Интерсептор для обновления токенов
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post("/refresh-token", {
                    refreshToken: localStorage.getItem("refresh_token"),
                });

                localStorage.setItem("access_token", data.access_token);
                axiosInstance.defaults.headers[
                    "Authorization"
                ] = `Bearer ${data.access_token}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
