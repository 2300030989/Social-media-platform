# Social Media Platform

A full-stack social media app:
- Frontend: React (Vite), Tailwind, served via Nginx in Docker
- Backend: Spring Boot (Java 17), MySQL

## Run locally with Docker Compose

- docker compose up -d
- Frontend: http://localhost:3000
- Backend: http://localhost:8081

## Environment

- MySQL service is named `db` inside the Compose network
- Backend reads SPRING_DATASOURCE_* from docker-compose.yml

## CI/CD

- .github/workflows/ci.yml builds backend and frontend on push/PR
- .github/workflows/deploy-pages.yml deploys frontend to GitHub Pages on main
