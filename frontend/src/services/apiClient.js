import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:7777/api",
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const res = await axios.post(
                        "http://localhost:7777/api/token/refresh",
                        { refreshToken }
                    );
                    const newAccessToken = res.data.accessToken;
                    localStorage.setItem("accessToken", newAccessToken);

                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(error.config);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    localStorage.clear();
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
