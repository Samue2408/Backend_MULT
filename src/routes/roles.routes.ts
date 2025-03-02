import { Router } from "express";
import { getRoles } from "../controllers/roles.controller";

const router = Router();

router.get('/', getRoles);

export default router;