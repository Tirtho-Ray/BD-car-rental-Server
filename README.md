# Car Rental Reservation System

## Overview

The Car Rental Reservation System is a backend API designed to manage car rentals, reservations, and user accounts. It is built with TypeScript, Express.js, and Mongoose, providing a robust and scalable solution for car rental services.

## Technology Stack

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.
- **Mongoose**: A MongoDB object modeling tool designed to work in an asynchronous environment.
- **JWT (jsonwebtoken)**: A compact, URL-safe means of representing claims to be transferred between two parties.

## Features
- **User Authentication**: Secure user login and registration using JWT.
- **Car Management**: CRUD operations for managing car inventory.
- **Reservation Management**: Create, read, update, and delete car reservations.
- **User Roles**: Admin and user roles with different access levels.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/car-rental-reservation-system.git
    ```

2. Change into the project directory:
    ```bash
    cd car-rental-reservation-system
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    PORT=5000
    JWT_ACCESS_SECRET=secret
    JWT_ACCESS_EXPIRES_IN=7d
    JWT_REFRESH_SECRET=refreshsecret
    JWT_REFRESH_EXPIRES_IN=1y
    ```

5. Start the server:
    ```bash
    spread two terminal
    tsc -w
    npm run start:Server
    ```

## API Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login an existing user.

### Cars
- **GET /api/cars**: Get all cars.
- **POST /api/cars**: Add a new car (Admin only).
- **GET /api/cars/:id**: Get a car by ID.
- **PUT /api/cars/:id**: Update a car by ID (Admin only).
- **DELETE /api/cars/:id**: Delete a car by ID (Admin only).

### Reservations
- **POST /api/bookings**: Create a new reservation.(USer only)
- **GET-MY-BOOKING /api/bookings/my-bookings**: Get a reservation by ID.(USer only).
- **GET-All-BOOKING /api/bookings**: Get a reservation by ID (Admin only).
- **PAtch /api/cars/return**: Update a reservation by ID.(Admin only).




