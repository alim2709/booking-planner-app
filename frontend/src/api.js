// import axios from "axios";

// // Базовый URL для вашего бэкенда
// const API_BASE_URL = "http://localhost:5000/api";

// // Получение данных с сервера
// export const fetchData = async () => {
//     try {
//         const response = await axios.get(`${API_BASE_URL}/data`);
//         return response.data; // Возвращаем данные
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         throw error;
//     }
// };

// // Отправка данных на сервер
// export const submitData = async (payload) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/submit`, payload);
//         return response.data; // Возвращаем подтверждение
//     } catch (error) {
//         console.error("Error submitting data:", error);
//         throw error;
//     }
// };

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7777",
});

export default api;
