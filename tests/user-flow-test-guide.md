# User Flow Test Guide

This document provides a comprehensive guide for testing the user flow in the Car Auction System.

## Overview of User Flow

The user flow follows these main steps:

1. **Register User** - Create a new user account
2. **Login User** - Authenticate and receive access token
3. **Logout User** - End user session

## Unit Tests

We have implemented comprehensive unit tests for the user flow:

- **Model Tests** - Test the user schema, validation, and methods
- **Service Tests** - Test the business logic in isolation
- **Controller Tests** - Test the HTTP request/response handling
- **Route Tests** - Test the API endpoints and middleware integration

Run the unit tests with:

```bash
npm test
```

## Manual Testing Guide

### Prerequisites

- A running instance of the application
- Postman or similar API testing tool

### 1. Register a User

**Request:**
```
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
```
Status: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "<user-id>",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "dealer",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:00:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try registering with missing required fields
- Try registering with an invalid email format
- Try registering with a password that doesn't meet requirements
- Try registering with an email that's already in use

### 2. Login User

**Request:**
```
POST /user/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "User login successfully",
  "data": {
    "user": {
      "_id": "<user-id>",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "dealer",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:00:00.000Z"
    },
    "token": "<jwt-token>"
  }
}
```

**Validation Tests:**
- Try logging in with a non-existent email
- Try logging in with an incorrect password
- Try logging in with missing required fields

### 3. Logout User

**Request:**
```
POST /user/logout
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "User logged out successfully",
  "data": null
}
```

**Validation Tests:**
- Try logging out without authentication
- Try logging out with an invalid token

## Integration Testing

For integration testing, follow these steps to test the complete user flow:

1. Register a new user
2. Login with the registered user credentials
3. Access protected resources using the token
4. Logout the user
5. Verify that protected resources are no longer accessible

## Automated End-to-End Testing

For automated end-to-end testing, you can use tools like Cypress or Playwright to simulate user interactions with the frontend application. The test should cover:

1. User registration
2. User login
3. Accessing protected resources
4. User logout

## Authentication Flow

The authentication flow in the system works as follows:

1. **Registration**: User provides name, email, and password. The system validates the input, hashes the password, and stores the user in the database.

2. **Login**: User provides email and password. The system validates the input, checks if the email exists, verifies the password, and generates a JWT token.

3. **Authentication**: For protected routes, the system verifies the JWT token in the Authorization header or cookie.

4. **Logout**: The system clears the token cookie.

## Password Security

The system implements several security measures for passwords:

1. **Validation**: Passwords must be 6-30 characters long and can include letters, numbers, and special characters.

2. **Hashing**: Passwords are hashed using bcrypt with a salt factor of 10 before storage.

3. **Comparison**: When a user logs in, the provided password is compared with the stored hash using bcrypt's compare function.

## JWT Token

The JWT token contains the following claims:

- **_id**: The user's ID
- **email**: The user's email
- **role**: The user's role (dealer or admin)
- **iat**: Issued at timestamp
- **exp**: Expiration timestamp (default: 1 day from issuance)

The token is signed using the JWT_SECRET environment variable and expires according to the JWT_SECRET_EXPIRY environment variable.

## Role-Based Access Control

The system supports two roles:

1. **dealer**: Regular users who can participate in auctions
2. **admin**: Administrative users with additional privileges

The role is set during registration (default: dealer) and is included in the JWT token for role-based access control.
