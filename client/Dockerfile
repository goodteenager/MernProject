FROM node:18-alpine

WORKDIR /app

# Кэшируем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальное
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
