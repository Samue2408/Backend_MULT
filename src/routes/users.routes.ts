import { Router } from "express";
import { changePassword, deleteUser, getUser, getUserByRole, getUsers, postUser, putUser, verifyUserCredentials} from "../controllers/users.controller";
import { findRefreshToken, generateTokens, refreshAccessToken } from "../controllers/user_tokens.controller";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/role/:role_id', getUserByRole);

router.put('/update/:id', putUser);
router.put('/change-password/', changePassword);

router.delete('/:id', deleteUser);

router.post('/', postUser);
router.post('/login', verifyUserCredentials, findRefreshToken);
router.post('/refresh', refreshAccessToken);
router.post('/createTokens', generateTokens);

export default router;

