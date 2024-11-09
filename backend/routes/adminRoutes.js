import { Router } from 'express';
import { register, login, getAdmin } from '../controllers/adminController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getAdmin/:id', getAdmin);

export default router;
