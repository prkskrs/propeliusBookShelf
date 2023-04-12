import { login, signup, myBookShelf } from "../contollers/userController.js";
import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
const router = express.Router();

/**
 * Endpoint: /api/v1/
 */

router.route("/auth/signup").post(signup);
router.route("/auth/login").post(login);
router.route("/auth/myBookShelf").get(authenticate, myBookShelf);

export default router;
