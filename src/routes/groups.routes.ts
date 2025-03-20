import { Router } from "express";
import {getGroups, getGroup, postGroup, putGroup, deleteGroup} from '../controllers/groups.controller';

const router = Router();

router.get('/', getGroups);
router.get('/:id', getGroup);

router.post('/', postGroup);

router.put('/:id', putGroup);

router.delete('/:id', deleteGroup);


export default router;