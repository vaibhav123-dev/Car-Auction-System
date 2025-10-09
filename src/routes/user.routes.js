import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/user.controller.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);

export default router;
