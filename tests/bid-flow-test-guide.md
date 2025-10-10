# Bid Flow Test Guide

This document provides a comprehensive guide for testing the bid flow in the Car Auction System.

## Overview of Bid Flow

The bid flow involves two main operations:

1. **Place a Bid** – Dealers place bids on active auctions.
2. **Get Winner Bid** – Retrieve the highest bid for a particular auction.

The bid routes are mounted under `/auction` as follows:

- **POST /auction/placeBids** — Place a bid
- **GET /auction/:auctionId/winner-bid** — Get the current winning bid for an auction

## Unit Tests Overview

Unit tests cover the following areas:

- **Model Tests**  
  Test the Bid schema validation, required fields, and custom validators.

- **Service Tests**  
  Test business logic in `placeBidService` and `getWinnerBidService`, including:
  - Validations of auction status, user role, bid amounts
  - Bid creation and updates
  - Error handling for invalid scenarios

- **Controller Tests**  
  Test request validation, response handling, and error forwarding in `placeBid` and `winnerBid` controllers.

- **Route Tests**  
  Test bid routes with middleware to verify correct HTTP status codes and input validation.

Run all tests using:

```bash
npm test
```

## Manual Testing Guide

### Prerequisites

- Application running locally or in test environment
- API testing tool like Postman or Curl

### 1. Place a Bid

**Request:**
```
POST /auction/placeBids
Content-Type: application/json
Authorization: Bearer <dealer-jwt-token>

{
  "auction_id": "60d0fe4f5311236168a109cc",
  "amount": 15000
}
```

**Expected Response:**
```
Status: 201 Created
{
  "success": true,
  "message": "Bid added successfully",
  "data": {
    "_id": "<bid-id>",
    "amount": 15000,
    "dealer_id": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Test Dealer",
      "email": "dealer@example.com",
      "role": "dealer"
    },
    "auction_id": "60d0fe4f5311236168a109cc",
    "previous_bid_id": null,
    "createdAt": "2025-10-10T10:00:00.000Z",
    "updatedAt": "2025-10-10T10:00:00.000Z"
  }
}
```

**Validation & Business Rule Tests:**

- Attempt placing bid on non-existent auction → expect 404
- Place bid on auction with inactive status → expect 400
- Bid amount ≤ auction’s starting price → expect 400
- Bid amount ≤ previous highest bid → expect 400
- Place bid after auction ended → expect 400
- Place bid with non-dealer user → expect 403

### 2. Get Winner Bid for Auction

**Request:**
```
GET /auction/60d0fe4f5311236168a109cc/winner-bid
```

**Expected Response:**
```
Status: 200 OK
{
  "success": true,
  "message": "Winner bid fetched successfully",
  "data": {
    "_id": "<winning-bid-id>",
    "amount": 15200,
    "dealer_id": {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "Test Dealer",
      "email": "dealer@example.com",
      "role": "dealer"
    },
    "auction_id": "60d0fe4f5311236168a109cc",
    "createdAt": "2025-10-10T10:15:00.000Z"
  }
}
```

**Validation Tests:**

- Request winner bid for non-existent auction → expect 404
- Request winner bid when no bids exist → expect 404

## Integration Testing

Test the complete flow:

1. Create an auction (admin)
2. Register and authenticate a dealer user
3. Place multiple bids with increasing amounts
4. Fetch winner bid and verify it matches highest bid
5. Verify placing bids after auction end fails
6. Test concurrent bids to check correct winner behavior

## Automated End-to-End Testing

Use tools like Cypress or Playwright to simulate:

1. Dealer user login
2. Navigation to auction page
3. Bid placement UI flows
4. Display of current winner bid
5. Auction end scenario and winner announcement

## Authentication & Authorization

- Only authenticated users with role dealer can place bids.
- JWT token is required in Authorization header for bid placements.
- Winner bid endpoint is public or can be restricted based on system needs.

## Error Handling

Common error responses include:

| Scenario              | Status Code | Message                                                        |
|-----------------------|-------------|----------------------------------------------------------------|
| Auction not found     | 404         | "Auction not found"                                            |
| Auction not active    | 400         | "Auction is not active"                                        |
| User not found        | 404         | "User not found"                                               |
| User role not dealer  | 403         | "Only dealers can place bids"                                  |
| Bid amount too low    | 400         | "Bid amount must be greater than starting price/previous bid"  |
| Auction has ended     | 400         | "Auction has already ended"                                    |
| No winner bid found   | 404         | "No bids found for this auction"                               |

***End of Bid Flow Test Guide***
