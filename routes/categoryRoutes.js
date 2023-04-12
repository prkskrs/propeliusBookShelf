import {
  addCategory,
  getAllCategory,
} from "../contollers/categoryController.js";
import express from "express";
const router = express.Router();

/**
 * Endpoint: /api/v1/
 */

router.route("/category/addCategory").post(addCategory);
router.route("/category").get(getAllCategory);

export default router;
