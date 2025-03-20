import { Router } from "express";
import {getSubjects, getSubject, postSubject, putSubject, deleteSubject} from "../controllers/subjects.controller";



const router = Router();

router.get('/', getSubjects);
router.get('/:id', getSubject);

router.post('/', postSubject);

router.put('/:id', putSubject);

router.delete('/:id', deleteSubject);


export default router;