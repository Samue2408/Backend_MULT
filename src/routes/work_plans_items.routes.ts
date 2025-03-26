import { Router } from "express";
import { getWorkPlansItems, getWorkPlanItem, postWorkPlanItem, putWorkPlanItem, deleteWorkPlanItem} from "../controllers/work_plans_items.controller";

const router = Router();

router.get('/', getWorkPlansItems);
router.get('/:item_id/:work_plan_id', getWorkPlanItem);

router.post('/', postWorkPlanItem);

router.put('/:item_id/:work_plan_id', putWorkPlanItem);

router.delete('/:item_id/:work_plan_id', deleteWorkPlanItem);

export default router;