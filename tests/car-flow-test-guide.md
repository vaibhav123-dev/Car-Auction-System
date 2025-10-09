# Car Flow Test Guide

This document provides a comprehensive guide for testing the car flow in the Car Auction System.

## Overview of Car Flow

The car flow follows these main steps:

1. **Create Car** - Register a new car in the system
2. **Update Car** - Modify car details
3. **Get Car** - Retrieve car details
4. **Get Cars** - List all cars with optional filters
5. **Get User Cars** - List cars owned by the current user
6. **Delete Car** - Remove a car from the system

## Unit Tests

We have implemented comprehensive unit tests for the car flow:

- **Model Tests** - Test the car schema, validation, and methods
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
- Valid authentication token (JWT)
- Postman or similar API testing tool

### 1. Create a Car

**Request:**
```
POST /car
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2020,
  "price": 25000,
  "description": "Well maintained sedan",
  "images": ["image1.jpg", "image2.jpg"]
}
```

**Expected Response:**
```
Status: 201 Created
{
  "success": true,
  "message": "Car created successfully",
  "data": {
    "car": {
      "_id": "<car-id>",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "price": 25000,
      "description": "Well maintained sedan",
      "images": ["image1.jpg", "image2.jpg"],
      "owner": "<user-id>",
      "status": "available",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:00:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try creating a car with missing required fields
- Try creating a car with invalid data (e.g., negative mileage, year before 1900)

### 2. Update a Car

**Request:**
```
PUT /car/<car-id>
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "price": 28000,
}
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Car updated successfully",
  "data": {
    "car": {
      "_id": "<car-id>",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "price": 28000,
      "description": "Well maintained sedan",
      "images": ["image1.jpg", "image2.jpg"],
      "owner": "<user-id>",
      "status": "available",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:10:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try updating a non-existent car
- Try updating a car you don't own
- Try updating a car that's in auction
- Try updating with invalid data

### 3. Get a Car by ID

**Request:**
```
GET /car/<car-id>
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Car retrieved successfully",
  "data": {
    "car": {
      "_id": "<car-id>",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "price": 28000,
      "description": "Well maintained sedan",
      "images": ["image1.jpg", "image2.jpg"],
      "owner": {
        "_id": "<user-id>",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "status": "available",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:10:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try getting a non-existent car

### 4. Get All Cars

**Request:**
```
GET /car
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Cars retrieved successfully",
  "data": {
    "cars": [
      {
        "_id": "<car-id-1>",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        "price": 28000,
        "description": "Well maintained sedan",
        "images": ["image1.jpg", "image2.jpg"],
        "owner": {
          "_id": "<user-id>",
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "status": "available",
        "createdAt": "2025-10-09T12:00:00.000Z",
        "updatedAt": "2025-10-09T12:10:00.000Z"
      },
      // Other cars...
    ]
  }
}
```

### 5. Get Cars with Filters

**Request:**
```
GET /car?make=Toyota&model=Camry&year=2020&minPrice=20000&maxPrice=30000&status=available
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Cars retrieved successfully",
  "data": {
    "cars": [
      // Only cars matching the filters...
    ]
  }
}
```

### 6. Get User's Cars

**Request:**
```
GET /car/my-cars
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "User cars retrieved successfully",
  "data": {
    "cars": [
      // Only cars owned by the current user...
    ]
  }
}
```

### 7. Delete a Car

**Request:**
```
DELETE /car/<car-id>
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Car deleted successfully",
  "data": {
    "car": {
      "_id": "<car-id>",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "price": 28000,
      "description": "Well maintained sedan",
      "images": ["image1.jpg", "image2.jpg"],
      "owner": "<user-id>",
      "status": "available",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:10:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try deleting a non-existent car
- Try deleting a car you don't own
- Try deleting a car that's in auction

## Integration Testing

For integration testing, follow these steps to test the complete car flow:

1. Register a new user
2. Login with the user credentials
3. Create a new car
4. Update the car details
5. Get the car details
6. Get all cars with filters
7. Get user's cars
8. Delete the car

## Automated End-to-End Testing

For automated end-to-end testing, you can use tools like Cypress or Playwright to simulate user interactions with the frontend application. The test should cover:

1. User registration and login
2. Car creation
3. Car update
4. Car retrieval
5. Car deletion

## Car Status Flow

The car status can be in one of the following states:

1. **available**: The car is available for auction
2. **in_auction**: The car is currently in an active auction
3. **sold**: The car has been sold through an auction

The status transitions are as follows:

- When a car is created, its status is set to **available**
- When a car is added to an auction, its status is changed to **in_auction**
- When an auction ends with a successful bid, the car's status is changed to **sold**

## Car-Auction Integration

The car and auction systems are integrated as follows:

1. When creating an auction, a car ID is provided
2. The system checks if the car exists and is available
3. If the car is available, its status is changed to **in_auction**
4. When the auction ends, the car's status is updated accordingly

## Owner Authorization

The car system implements owner-based authorization:

1. Only the owner of a car can update or delete it
2. Anyone can view car details
3. A car cannot be updated or deleted while it's in an auction

This ensures that only the rightful owner can modify their cars, and prevents modifications during active auctions.
