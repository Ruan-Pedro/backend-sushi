import { Router } from "express"
import userController from '../controllers/testControllers';
const router = Router();

router.get('/', (req, res)=>{
    return res.status(200).send({msg:"TS server"})
})
router.get('/users', userController.index);
router.get('/create', userController.create);

export default router;