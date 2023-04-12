import { addBook, getAllBook } from "../contollers/bookController.js";
import { authenticate } from "../middlewares/authenticate.js";
import express from "express";
import upload from "../middlewares/fileUpload.js";

const router = express.Router();

/**
 * Endpoint: /api/v1/
 */


router
  .route("/book/addBook")
  .post(authenticate, upload.fields([{ name: "coverImage" }]), addBook);
router.route("/book").get(getAllBook);

export default router;
