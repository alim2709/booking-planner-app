import apiClient from "./apiClient";

// Установим токены для теста

localStorage.setItem("accessToken", response.data.access_token); // Обратите внимание на правильное имя ключа
localStorage.setItem("refreshToken", response.data.refresh_token);

// Тестовый запрос
apiClient
    .get("/appointments")
    .then((response) => {
        console.log("Успешный ответ:", response.data);
    })
    .catch((error) => {
        console.error("Ошибка:", error.response?.data || error.message);
    });
