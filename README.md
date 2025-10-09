# Car Auction System

A comprehensive platform for car auctions where dealers can register, list cars, create auctions, and place bids.

## Table of Contents

1. [System Overview](#system-overview)
2. [Features](#features)
3. [System Flow](#system-flow)
4. [Prerequisites](#prerequisites)
5. [Environment Setup](#environment-setup)
6. [Local Setup](#local-setup)
7. [API Documentation](#api-documentation)
8. [Branching & PR Flow](#branching--pr-flow)
9. [Development Guidelines](#development-guidelines)
10. [Testing](#testing)

---

## System Overview

The Car Auction System is a platform that enables car dealers to list their vehicles for auction and participate in bidding on other dealers' vehicles. The system follows a microservice-like architecture with clear separation of concerns between different components.

### Core Entities

- **User**: Represents dealers and administrators in the system
- **Car**: Represents vehicles that can be listed for auction
- **Auction**: Represents an auction event for a specific car
- **Bid**: Represents a bid placed by a user on an auction

### Entity Relationships

```
User (Dealer) --owns--> Car --listed in--> Auction <--places bid on-- User (Bidder)
                                              |
                                              v
                                             Bid
```

### Architecture

The system follows a layered architecture:

- **Routes Layer**: Handles HTTP requests and routes them to appropriate controllers
- **Controller Layer**: Processes requests, validates input, and coordinates with services
- **Service Layer**: Contains business logic and interacts with models
- **Model Layer**: Represents data structures and interacts with the database

---

## Features

### User Management

- **User Registration**: Dealers can register with name, email, and password
- **User Authentication**: JWT-based authentication system
- **Role-Based Access Control**: Different permissions for dealers and administrators

### Car Management

- **Car Registration**: Dealers can register their cars with details like make, model, year, price
- **Car Listing**: View all available cars or filter by various criteria
- **Car Ownership**: Only the owner can update or delete their cars

### Auction Management

- **Auction Creation**: Create auctions for cars with starting price and time period
- **Auction Lifecycle**: Auctions progress through draft, upcoming, active, and completed states
- **Auction Updates**: Modify auction details while in draft state

### Bidding System

- **Bid Placement**: Place bids on active auctions
- **Bid History**: View all bids placed on an auction
- **Winning Determination**: Highest bid at auction end wins

---

## System Flow

### User Flow

1. **Registration**: User registers with name, email, and password
2. **Authentication**: User logs in with email and password to receive JWT token
3. **Authorization**: Token is used for accessing protected resources

### Car Flow

1. **Creation**: Dealer creates a car with details (make, model, year, price, etc.)
2. **Management**: Dealer can update or delete their cars (if not in auction)
3. **Listing**: Cars can be listed and filtered by various criteria

### Auction Flow

1. **Creation**: Dealer creates an auction for a car (status: draft)
2. **Configuration**: Dealer sets starting price, start time, and end time
3. **Activation**: Auction is started, changing status to upcoming or active
4. **Progression**: Auction automatically transitions from upcoming to active based on time
5. **Completion**: Auction ends at the specified end time

### Bid Flow

1. **Placement**: Users place bids on active auctions (must be higher than current highest bid)
2. **Tracking**: System tracks all bids and updates highest bid
3. **Winning**: At auction end, highest bidder wins the auction
4. **Settlement**: Car ownership is transferred to the winning bidder

---

## Prerequisites

- **Node.js** version v18+ and `npm install`
- **MongoDB Atlas** connection string in `.env`
- **GitHub repo access**
- **VS Code** with ESLint and Prettier extensions

---

## Environment Setup

Refer to the `.env.sample` file for local setup:

```plaintext
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.az8oejc.mongodb.net/
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1h
```

Replace `<username>` and `<password>` with your credentials.

---

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/vaibhav123-dev/Car-Auction-System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Car-auction-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

   - If you encounter `ERESOLVE` errors, use:
     ```bash
     npm install --legacy-peer-deps
     ```
4. Install Husky hooks:
   ```bash
   npm run prepare
   ```
5. Copy `.env.sample` to `.env` and fill in the required values:
   - `MONGO_URI`, `JWT_SECRET`, etc.
6. Start the development server:
   ```bash
   npm run dev
   ```
   This will start the server with `nodemon` (see `package.json` for details).

---

## API Documentation

### Base URL

All API endpoints are prefixed with: `/api/v1`

### Authentication

Most endpoints require authentication via JWT token:

```
Authorization: Bearer <your-token>
```

### User Endpoints

#### Register User
```
POST /user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

#### Login User
```
POST /user/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

#### Logout User
```
POST /user/logout
Authorization: Bearer <your-token>
```

### Car Endpoints

#### Create Car
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

#### Get Car by ID
```
GET /car/<car-id>
Authorization: Bearer <your-token>
```

#### Get All Cars
```
GET /car
Authorization: Bearer <your-token>
```

#### Get User's Cars
```
GET /car/my-cars
Authorization: Bearer <your-token>
```

#### Update Car
```
PUT /car/<car-id>
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "price": 28000
}
```

#### Delete Car
```
DELETE /car/<car-id>
Authorization: Bearer <your-token>
```

### Auction Endpoints

#### Create Auction
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

#### Start Auction
```
POST /auction/<auction-id>/start
Authorization: Bearer <your-token>
```

#### Get Auction by ID
```
GET /auction/<auction-id>
Authorization: Bearer <your-token>
```

#### Get All Auctions
```
GET /auction
Authorization: Bearer <your-token>
```

#### Update Auction
```
PUT /auction/<auction-id>
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "startingPrice": 22000,
  "startTime": "2025-10-11T10:00:00Z"
}
```

### Bid Endpoints

#### Place Bid
```
POST /bid
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "auctionId": "<auction-id>",
  "amount": 25000
}
```

#### Get Bids for Auction
```
GET /bid/auction/<auction-id>
Authorization: Bearer <your-token>
```

#### Get User's Bids
```
GET /bid/my-bids
Authorization: Bearer <your-token>
```

---

## Branching & PR Flow

- **Main Branch**: Protected (no direct pushes allowed).
- **Feature Branches**: Each developer creates a branch from `main`:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/<entity>/<short-description>
  ```
  Example:
  ```bash
  feature/car/create-model
  feature/car/create-controller
  ```
- After completing the work:
  ```bash
  git push origin feature/<entity>/<short-description>
  ```
- Open a Pull Request (PR) to `main` and request one reviewer.

---

## Development Guidelines

### Linting, Formatting & Pre-Push Hooks

- **Lint**:
  ```bash
  npm run lint
  ```
- **Auto-fix Lint Errors**:
  ```bash
  npm run lint-fix
  ```
- **Format Code**:
  ```bash
  npm run format
  ```
- **Run Tests**:
  ```bash
  npm run test
  ```

> **Note**: Husky pre-push hooks will run `npm run lint && npm run test`.  
> If your push is blocked, fix linter errors/tests locally, then re-commit and push.

### Code Structure

#### Model

```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
```

#### Routes

In `routes/index.js`:

```javascript
router.use('user', userRoutes);
```

In `user.routes.js`:

```javascript
routes.route.post('/register', registerUser);
```

#### Controller

```javascript
const registerUser = asyncHandler(async (req, res, next) => {
  // Validation
  // Business logic in service.js file
  // You don't need to handle exceptional errors; asyncHandler and errorMiddleware will handle them automatically.
  // For validation or logic errors, follow the structure below:

  throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User already exists');

  // For responses, follow the structure below:
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, { data }, 'message'));
});
```

#### Service

```javascript
const registerService = asyncHandler(async (userData) => {
  // Get input for query from controller
  // All business and DB query logic, then return the response to the controller
});
```

### Validation

- Create a **JOI validation file** in the `validation` folder.
- Use this file to validate incoming request payloads in the controller.

---

## Testing

### Unit Tests

The system includes comprehensive unit tests for all components:

- **Model Tests**: Test schema validation and methods
- **Service Tests**: Test business logic in isolation
- **Controller Tests**: Test HTTP request/response handling
- **Middleware Tests**: Test authentication and error handling

Run unit tests with:

```bash
npm test
```

### Manual Testing

Detailed testing guides are available for each flow:

- **User Flow**: Registration, login, logout
- **Car Flow**: Creation, update, retrieval, deletion
- **Auction Flow**: Creation, start, update, retrieval
- **Bid Flow**: Placement, retrieval

### Test Guides

For detailed testing procedures, refer to:

- `tests/user-flow-test-guide.md`
- `tests/car-flow-test-guide.md`
- `tests/auction-flow-test-guide.md`

---

## Project Team

- **Vaibhav**: Project setup, User management
- **Shrikant**: Car management
- **Musadhiek**: Auction management
- **Kiran**: Bid management
