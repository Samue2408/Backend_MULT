import { Router } from "express";
import { getWorkingDays } from "../controllers/working_days.controller";

const router = Router();

router.get('/', getWorkingDays);

export default router;