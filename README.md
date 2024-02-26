# Project Title : Queezo Coding App

![Project Logo](client/assets/images/login.png)

## Introduction
This project is a comprehensive quiz application designed to provide users with an engaging platform to test their knowledge across various subjects. It encompasses features for user authentication, quiz creation, management, and taking, as well as result tracking and performance analysis.

## Project Type
Fullstack

## Deployed App
- Frontend: [Link to deployed frontend](https://variable-sculptress-6789-zeta.vercel.app/)
- Backend: [Link to deployed backend](https://variable-sculptress-6789-e41a.onrender.com)
- Database: [Link to deployed database](mongodb+srv://masai:****@cluster0.rkxhwns.mongodb.net/quizApp?retryWrites=true&w=majority)

## Directory Structure
variable-sculptress-6789
├─ server/
├─ client/

## Features
List out the key features of your application.
- User authentication (signup, login, logout)
- Quiz creation, management, and taking
- Result tracking and analysis
- Multi-level sorting of users
- CRUD operations for questions and rooms
- Multi-level user access control
- Implemented role-based access control to differentiate between user roles.

## Technology Stack
- Node.js: Server-side JavaScript runtime environment.
- Express.js: Web application framework for Node.js.
- MongoDB: NoSQL database used for data storage.
- bcrypt: Library for hashing passwords.
- jwt: Library for generating JSON Web Tokens.
- multer: Middleware for handling file uploads.

  ## API Endpoints

### User Endpoints
- `GET /api/user/:userId` - Retrieve user details by user ID.
- `GET /api/user` - Retrieve list of users, with optional sorting and limiting.
- `POST /api/signup` - User signup with validation.
- `POST /api/login` - User login with authentication.
- `GET /api/logout` - User logout with token blacklisting.

### Question Endpoints
- `GET /api/questions` - Retrieve questions with optional filtering by level and language.
- `POST /api/questions/create` - Create a new question (requires admin access).
- `DELETE /api/questions/:id` - Delete a question by ID (requires admin access).
- `PATCH /api/questions/update/:id` - Update a question by ID (requires admin access).

### Room Endpoints
- `POST /api/rooms` - Create a new room.
- `GET /api/rooms` - Retrieve all rooms.

### Result Endpoints
- `GET /api/results/:userId` - Retrieve results by user ID.
- `GET /api/results` - Retrieve all results.
- `POST /api/results/add` - Add a new result.
- `DELETE /api/results/:resultId` - Delete a result by result ID.
- `PATCH /api/results/update` - Update a result.

### Language Endpoints
- `GET /api/languages` - Retrieve all languages.
- `GET /api/languages/:languageId` - Retrieve a language by ID.
- `POST /api/languages/add` - Add a new language.


## Installation & Getting Started
Detailed instructions on how to install, configure, and get the project running. For BE/FS projects, guide the reviewer on how to check MongoDB schema etc.
```bash
cd server
npm run server
