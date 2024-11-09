import { Router } from 'express';
import multer from 'multer';
import { storage } from '../cloudconfig.mjs';
import { createEmployee, getEmployees, getEmployee, editEmployee, deleteEmployee } from '../controllers/employeeController.js';
import authorization from '../middleware/auth.js';

const upload = multer({ storage: storage });
const router = Router();

router.post('/create', authorization, upload.single("image"), createEmployee);
router.get("/", authorization, getEmployees);
router.get("/:id", authorization, getEmployee);
router.post("/edit/:id", authorization, upload.single('image'), editEmployee);
router.delete('/delete/:id', authorization, deleteEmployee);

export default router;
