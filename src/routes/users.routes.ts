import { Router } from "express";
import { deleteUser, getUser, getUserByRole, getUsers, postUser, putUser} from "../controllers/users.controller";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/role/:role_id', getUserByRole);
router.post('/', postUser);
router.put('/:id', putUser);
router.delete('/:id', deleteUser);

export default router;

