import { Router } from "express";
import { deleteUser, getUser, getUserByRole, getUsers, postUser, putUser, verifyUserCredentials} from "../controllers/users.controller";
import { findRefreshToken, generateTokens, refreshAccessToken } from "../controllers/user_tokens.controller";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/role/:role_id', getUserByRole);
router.post('/', postUser);
router.put('/:id', putUser);
router.delete('/:id', deleteUser);
router.post('/login', verifyUserCredentials, findRefreshToken);
router.post('/refresh', refreshAccessToken);
router.post('/createTokens', generateTokens);

export default router;

