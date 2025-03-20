import { Router } from "express";
import { getFaculties, getFaculty, postFaculty, putFaculty, deleteFaculty} from "../controllers/faculties.controller";

const router = Router();

router.get('/', getFaculties);
router.get('/:id', getFaculty);

router.post('/', postFaculty);

router.put('/:id', putFaculty);

router.delete('/:id', deleteFaculty);

export default router;