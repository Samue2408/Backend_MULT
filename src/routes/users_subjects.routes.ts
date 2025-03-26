
import { Router } from "express";
import { getUsersSubjects, getUserSubject, postUserSubject, putUserSubject, deleteUserSubject} from "../controllers/users_subjects.controller";
const router = Router();

router.get('/', getUsersSubjects);
router.get('/:id', getUserSubject);

router.post('/', postUserSubject);

router.put('/:id', putUserSubject);

router.delete('/:id', deleteUserSubject);

export default router;