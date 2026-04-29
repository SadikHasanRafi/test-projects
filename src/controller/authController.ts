import type { Request, Response } from "express";
import AuthService from "../services/authServices.js";

export default class AuthController {
    static signup = async (req: Request, res: Response) => {
        const { email, username, password } = req.body;

        const existingUser = await AuthService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const user = await AuthService.registerUser(email, username, password);
        return res.status(201).json(user);
    }
} 