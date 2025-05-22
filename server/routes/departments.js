import { Router } from "express";
import handler from "../handlers/departments.js";

const router = Router();

router.get("/", handler.departments);

export default router;
