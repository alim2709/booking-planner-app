# Используем базовый образ Node.js
FROM node:16

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы в контейнер
COPY . .

# Открываем порт 5173 (по умолчанию для Vite)
EXPOSE 5173

# Указываем команду для запуска Vite
CMD ["npm", "run", "dev", "--", "--host"]

