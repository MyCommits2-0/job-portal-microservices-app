FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Vite inlines VITE_* vars at build time, so they must arrive as build args, not
# runtime env vars - defaults match the gateway published on the host's port 8080.
ARG VITE_AUTH_SERVICE_URL=http://localhost:8080/auth
ARG VITE_PROFILE_SERVICE_URL=http://localhost:8080/api/profile
ARG VITE_APPLICATION_SERVICE_URL=http://localhost:8080/applications
ARG VITE_JOBS_SERVICE_URL=http://localhost:8080/jobs
ARG VITE_NOTIFICATION_SERVICE_URL=http://localhost:8080/notifications

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
