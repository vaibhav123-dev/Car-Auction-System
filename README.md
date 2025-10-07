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

## 4. Local setup

- git clone https://github.com/vaibhav123-dev/Car-Auction-System.git
- cd Car-auction-system
- npm install 
- npm run prepare        # runs "prepare" to install Husky
                         # if npm install fails with ERESOLVE: 
                         # npm install --legacy-peer-deps
- copy .env.sample into .env   # fill values (MONGO_URI, JWT_SECRET, etc.)
- npm run dev            # starts server with nodemon (see package.json)

## 5. Branching & PR flow
 
- main - (Protected no direct pushes)
- Each dev will create a branch from main 
- branch should look like feature/<entity>/<short-disc>  #example : feature/car/create-model, feature/car/create-controller 
- git checkout dev
- git pull origin main
- git checkout -b feature/car/create-model
          # code, test, lint, commit...
- git push origin feature/car/create-model
          # open PR to main, request one reviewer


## 6. Linting, formatting & pre-push hooks

- Lint: npm run lint
- Auto-fix lint: npm run lint-fix
- Format: npm run format
- Tests : npm run test

// Husky pre-push will run npm run lint && npm run test. If your push is blocked, fix linter errors/tests locally, then re-commit & push.

## 7. API endpoint structure

- /api/v1/auction

## 8. Validation

- create joi validation file in validation folder, use that to validated incoming req payload in controller

## 9. Development code look like

- model 
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);

- routes
 //in routes/index.js
 router.use('user', userRoutes)
 //in user.routes.js
 routes.route.post('/register', registerUser)

- controller
const registerUser = asyncHandler(async (req, res, next)=>{
    //validation
    // business logic in service.js file
    // you dont need to handle the exceptional error asyncHandler and errorMiddleware will handle that automatically.
    // for validation or logic error follow below code structure
    
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'User already exits')

    //for response follow below structure

    res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, {data}, 'message'))
})

- service 
const registerService = asyncHandler(async (userData)=>{
    //get input for query from controller
    //all bussiness and db query logic and then return the response to controller
})

- test
write test file in tests folder as user.test.js

- 