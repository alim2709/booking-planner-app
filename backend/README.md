# Booking Planner App

This project is a booking planner web application built with **FastAPI** for the backend, **PostgreSQL** as the database, and **Docker** for containerization. It leverages **SQLAlchemy** for ORM (Object-Relational Mapping) to manage database interactions and **Pydantic** for data validation and serialization.

## Table of Contents

- [Requirements](#requirements)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)

## Requirements

- Docker and Docker Compose

## Environment Setup

1. **Clone the repository:**

   ```
   https://github.com/alim2709/booking-planner-app.git
   cd booking-planner-app/backend

2.   **Environment Variables**

    To configure environment variables, this project includes an `env.sample` file as a template. This file lists all required environment variables with example values. You can use it to create your own `.env` file with the actual values for your environment.
    
3. **Edit the .env file and update the values as needed:**

    ```
    DB_PASS=YOUR_DB_PASS
    POSTGRES_PASSWORD=YOUR_DB_PASS
    JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY
    ACCESS_TOKEN_EXPIRE_MINUTES=ACCESS_TOKEN_EXPIRE_MINUTES
    REFRESH_TOKEN_EXPIRE_DAYS=REFRESH_TOKEN_EXPIRE_DAYS
    FASTAPI_CORS_ALLOWED_ORIGINS=FASTAPI_CORS_ALLOWED_ORIGINS
    
   ```


## Running the project

1. **Start Docker containers:**
    ```
   docker compose up --build
   ```
2. **Check container status:**
    ```
   docker compose ps 
    ```
3.  **Run migrations:**
   ```
   docker compose exec booking-planner-app alembic upgrade head
   ```

4. **Access the application:**
   
   The app should now be available at http://localhost:7777.