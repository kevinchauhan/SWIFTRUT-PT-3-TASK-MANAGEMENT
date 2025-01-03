# Task Management App

This is a full-stack Task Management Application designed to help users organize and manage their tasks efficiently. The app supports creating, viewing, editing, and deleting tasks, with additional features for categorization and role-based access control.

## Features

- **User Authentication**:

  - Signup and login functionality.
  - Password reset using email (Nodemailer integration).

- **Task Management**:

  - Create, view, edit, and delete tasks using modals.
  - Categorize tasks.
  - Mark tasks as completed.

- **Role-Based Access**:

  - Admin users can view and manage all tasks.
  - Regular users can manage their own tasks.

- **UI/UX**:
  - Minimalist theme for clean and intuitive user experience.
  - Responsive design for mobile and desktop views.

## Tech Stack

- **Frontend**:

  - React.js
  - TailwindCSS
  - Zustand (State Management)
  - Axios (HTTP Requests)
  - React Toastify (Notifications)

- **Backend**:

  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JSON Web Tokens (JWT) for authentication
  - Nodemailer for email notifications

- **Deployment**:
  - Frontend: [https://swiftrut-pt-3-task-management.vercel.app/](https://swiftrut-pt-3-task-management.vercel.app/)
  - Backend: [https://swiftrut-pt-3-task-management.onrender.com](https://swiftrut-pt-3-task-management.onrender.com)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud)
- A package manager (npm or yarn)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
