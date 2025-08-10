# Tasks App (Laravel API + React TypeScript SPA)

## Overview
Simple task manager with user registration, login, and task CRUD. Backend is Laravel (Sanctum). Frontend is React + TypeScript (Vite), styled with Tailwind CDN.

## Features
- User registration & login
- Create / Read / Update / Delete tasks
- Tasks belong to the authenticated user
- Validation & authorization enforced in backend
- Tests: PHPUnit for backend, React Testing Library for frontend

## Requirements
- PHP 8+, Composer, MySQL (or SQLite), Node.js 18+
- Laravel 10+, Vite + React

## Setup — Backend
1. Clone the repo and go to `backend` directory.
2. Install dependencies:
   ```bash
   composer install
   cp .env.example .env
   # edit DB settings in .env
   php artisan key:generate
   php artisan migrate
3. Start dev server:
   npm run dev
   
API endpoints
  POST /api/register  { name, email, password, password_confirmation } -> { user, token }
  POST /api/login     { email, password } -> { user, token }
  POST /api/logout    auth required

  GET /api/tasks      (auth) -> list of tasks for user
  POST /api/tasks     (auth) { title, description?, completed? } -> created task
  GET /api/tasks/{id} (auth) -> single task (only owner)
  PATCH /api/tasks/{id} (auth) -> update
  DELETE /api/tasks/{id} (auth) -> delete


Setup — Frontend
1. npm install
2. npm run dev
