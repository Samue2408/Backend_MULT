
import Router from 'express';
import { getWorkPlans, getWorkPlan, postWorkPlan, putWorkPlan, deleteWorkPlan } from '../controllers/work_plans.controller';

const router = Router();

router.get('/', getWorkPlans);
router.get('/:id', getWorkPlan);

router.post('/', postWorkPlan);

router.put('/:id', putWorkPlan);

router.delete('/:id', deleteWorkPlan);

export default router;