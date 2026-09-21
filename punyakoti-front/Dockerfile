# ---------- Build stage ----------
FROM node:20-alpine as build
WORKDIR /app

# Cache dependencies first
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Set build arguments (can be overridden in docker-compose)
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_RAZORPAY_KEY_ID
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

# Build the Vite application
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
