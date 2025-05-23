import { Router } from "express";
import handler from "../handlers/departments.js";
import { tryCatch } from "../lib/utils.js";

const router = Router();

router.get("/", tryCatch(handler.departments));

export default router;
