// import _default = require('@prisma/client');
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client.js';
// import { type PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default class AuthService{
    static registerUser = async (email: string, username: string, password: string) => {
        const hashedpassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedpassword
            }
        });
        return user;
    }


    static findUserById = async (id: number) => {
        const user = await prisma.user.findUnique({
            where: {
                id:id
            }
        });
        return user;
    }


    static findUserByEmail = async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email:email
            }
        });
        return user;
    }


    
}