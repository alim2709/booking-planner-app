import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:7777/api/",
});

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

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("Refresh token not available.");
                }

                // Запрос на обновление токенов
                const { data } = await axiosInstance.get("/refresh-token/", {
                    refreshToken,
                });

                localStorage.setItem("accessToken", data.access_token);
                localStorage.setItem("refreshToken", data.refresh_token);
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${data.access_token}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
