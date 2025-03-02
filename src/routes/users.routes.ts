import { Router } from "express";
import { getUser, getUserByRole, getUsers, postUser} from "../controllers/users.controller";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/role/:role_id', getUserByRole);
router.post('/', postUser);

export default router;

