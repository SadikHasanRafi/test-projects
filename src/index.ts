import dotenv from 'dotenv';
import express , { type Express, type Request, type Response } from 'express';
import cors from "cors";
import router from './router/auth.router.js';
dotenv.config();


const app: Express = express()

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use(cors())


app.use('/api',router )

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

