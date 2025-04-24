FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Копируем ВСЕ файлы сервера
COPY . .

EXPOSE 5000

# Исправляем команду запуска
CMD ["npm", "run", "dev"]