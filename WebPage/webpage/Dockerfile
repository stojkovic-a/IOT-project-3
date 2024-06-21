FROM node:20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:stable-alpine
COPY --from=builder /app/build/ /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3333
CMD ["nginx", "-g", "daemon off;"]
