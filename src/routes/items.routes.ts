import { Router } from "express";
import { getItems, getItem, postItem, putItem, deleteItem} from "../controllers/items.controller";



const router = Router();

router.get('/', getItems);
router.get('/:id', getItem);

router.post('/', postItem);

router.put('/:id', putItem);

router.delete('/:id', deleteItem);


export default router;