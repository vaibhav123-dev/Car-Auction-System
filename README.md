# Car-Auction-System

## 1. Quick Project Summary

Each developer owns one entity and implements the model, controller, routes, service, tests, validation (JOI), and utils where needed. Follow the folder structure and branch/PR rules so work can be reviewed & merged smoothly.

---

## 2. Prerequisites

- **Node.js** version v18+ and `npm install`
- **MongoDB Atlas** connection string in `.env`
- **GitHub repo access**
- **VS Code** with ESLint and Prettier extensions

---

## 3. Sample `.env` Setup

Refer to the `.env.sample` file for local setup:

```plaintext
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.az8oejc.mongodb.net/
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1h
```

//Replace `<username>` and `<password>` with your credentials.

---

## 4. Local Setup

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

## 5. Branching & PR Flow

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

## 6. Linting, Formatting & Pre-Push Hooks

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

---

## 7. API Endpoint Structure

- Base URL: `/api/v1/auction`

---

## 8. Validation

- Create a **JOI validation file** in the `validation` folder.
- Use this file to validate incoming request payloads in the controller.

---

## 9. Development Code Structure

### Model

```javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
```

### Routes

In `routes/index.js`:
```javascript
router.use('user', userRoutes);
```

In `user.routes.js`:
```javascript
routes.route.post('/register', registerUser);
```

### Controller

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

### Service

```javascript
const registerService = asyncHandler(async (userData) => {
    // Get input for query from controller
    // All business and DB query logic, then return the response to the controller
});
```

### Tests

Write test files in the `tests` folder. For example:
- `user.test.js`

---

## 10. Task Split

- **Vaibhav**: Project setup, Dealer
- **Shrikant**: Car
- **Musadhiek**: Auction
- **Kiran**: Bid
