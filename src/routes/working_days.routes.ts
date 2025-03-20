import { Router } from "express";
import { getWorkingDay, getWorkingDays, postWorkingDay, putWorkingDay, deletedWorkingDay} from "../controllers/working_days.controller";

const router = Router();

router.get('/', getWorkingDays);
router.get('/:id', getWorkingDay);


router.post('/', postWorkingDay);

router.put('/:id', putWorkingDay);

router.delete('/:id', deletedWorkingDay);

export default router;