# Auction Flow Test Guide

This document provides a comprehensive guide for testing the auction flow in the Car Auction System.

## Overview of Auction Flow

The auction flow follows these main steps:

1. **Create Auction** - Create a new auction in draft status
2. **Start Auction** - Change auction status to upcoming or active
3. **Update Auction** - Update auction details (only allowed in draft status)
4. **Get Auction** - Retrieve auction details
5. **Get Auctions** - List all auctions with optional filters

## Unit Tests

We have implemented comprehensive unit tests for the auction flow:

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

### 1. Create an Auction

**Request:**
```
POST /auction
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "carId": "<valid-car-id>",
  "startingPrice": 20000,
  "startTime": "2025-10-10T10:00:00Z",
  "endTime": "2025-10-15T10:00:00Z"
}
```

**Expected Response:**
```
Status: 201 Created
{
  "success": true,
  "message": "Auction created successfully",
  "data": {
    "auction": {
      "_id": "<auction-id>",
      "carId": "<car-id>",
      "startingPrice": 20000,
      "startTime": "2025-10-10T10:00:00.000Z",
      "endTime": "2025-10-15T10:00:00.000Z",
      "status": "draft",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:00:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try creating an auction with missing required fields
- Try creating an auction with a non-existent car ID
- Try creating an auction with a car that's already in an active auction
- Try creating an auction with end time before start time

### 2. Start an Auction

**Request:**
```
POST /auction/<auction-id>/start
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Auction started successfully",
  "data": {
    "auction": {
      "_id": "<auction-id>",
      "carId": "<car-id>",
      "startingPrice": 20000,
      "startTime": "2025-10-10T10:00:00.000Z",
      "endTime": "2025-10-15T10:00:00.000Z",
      "status": "upcoming", // or "active" if current time is within auction period
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:05:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try starting a non-existent auction
- Try starting an auction that's already started (not in draft status)
- Try starting an auction with end time in the past

### 3. Update an Auction

**Request:**
```
PUT /auction/<auction-id>
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "startingPrice": 22000,
  "startTime": "2025-10-11T10:00:00Z"
}
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Auction updated successfully",
  "data": {
    "auction": {
      "_id": "<auction-id>",
      "carId": "<car-id>",
      "startingPrice": 22000, // Updated
      "startTime": "2025-10-11T10:00:00.000Z", // Updated
      "endTime": "2025-10-15T10:00:00.000Z",
      "status": "draft",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:10:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try updating a non-existent auction
- Try updating an auction that's not in draft status
- Try updating with invalid data (e.g., end time before start time)

### 4. Get an Auction by ID

**Request:**
```
GET /auction/<auction-id>
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Auction retrieved successfully",
  "data": {
    "auction": {
      "_id": "<auction-id>",
      "carId": {
        "_id": "<car-id>",
        "make": "Toyota",
        "model": "Camry",
        "year": 2020,
        // Other car details...
      },
      "startingPrice": 22000,
      "startTime": "2025-10-11T10:00:00.000Z",
      "endTime": "2025-10-15T10:00:00.000Z",
      "status": "draft",
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:10:00.000Z"
    }
  }
}
```

**Validation Tests:**
- Try getting a non-existent auction

### 5. Get All Auctions

**Request:**
```
GET /auction
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Auctions retrieved successfully",
  "data": {
    "auctions": [
      {
        "_id": "<auction-id-1>",
        "carId": {
          "_id": "<car-id-1>",
          "make": "Toyota",
          "model": "Camry",
          // Other car details...
        },
        "startingPrice": 22000,
        "startTime": "2025-10-11T10:00:00.000Z",
        "endTime": "2025-10-15T10:00:00.000Z",
        "status": "draft",
        "createdAt": "2025-10-09T12:00:00.000Z",
        "updatedAt": "2025-10-09T12:10:00.000Z"
      },
      // Other auctions...
    ]
  }
}
```

### 6. Get Auctions with Filters

**Request:**
```
GET /auction?status=active&carId=<car-id>
Authorization: Bearer <your-token>
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Auctions retrieved successfully",
  "data": {
    "auctions": [
      // Only active auctions for the specified car...
    ]
  }
}
```

## Integration Testing

For integration testing, follow these steps to test the complete auction flow:

1. Create a new car
2. Create a new auction for the car (status: draft)
3. Update the auction details
4. Start the auction (status: upcoming or active)
5. Get the auction details
6. List all auctions with filters

## Automated End-to-End Testing

For automated end-to-end testing, you can use tools like Cypress or Playwright to simulate user interactions with the frontend application. The test should cover:

1. User login
2. Car creation
3. Auction creation
4. Auction update
5. Auction start
6. Viewing auction details
7. Filtering auctions

## Future Bid Flow Testing

Once the bid functionality is implemented, the testing flow will be extended to include:

1. Placing bids on active auctions
2. Retrieving bid history for an auction
3. Ending auctions and determining winners
4. Handling auction completion
