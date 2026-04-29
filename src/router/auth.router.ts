import { Router, type Request, type Response } from "express";
import AuthController from "../controller/authController.js";

const router = Router()


router.post('/auth/signup', AuthController.signup) 
export default router;