import apiClient from "./apiClient";


localStorage.setItem("accessToken", response.data.access_token); 
localStorage.setItem("refreshToken", response.data.refresh_token);

apiClient
    .get("/appointments")
    .then((response) => {
        console.log("Успешный ответ:", response.data);
    })
    .catch((error) => {
        console.error("Ошибка:", error.response?.data || error.message);
    });
