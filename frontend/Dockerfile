FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
# Prefer reproducible installs when a lockfile is present; otherwise fall back to npm install
RUN if [ -f package-lock.json ]; then \
			npm ci; \
		else \
			npm install; \
		fi

COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine

COPY --from=build /app/dist/archipel-libre-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
