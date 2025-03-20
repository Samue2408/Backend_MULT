import { Router } from "express";
import { getTypeActivities, getTypeActivity, postTypeActivity, putTypeActivity, deleteFaculty} from "../controllers/type_activities.controller";

const router = Router();

router.get('/', getTypeActivities);
router.get('/:id', getTypeActivity);

router.post('/', postTypeActivity);

router.put('/:id', putTypeActivity);

router.delete('/:id', deleteFaculty);

export default router;