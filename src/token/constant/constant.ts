import * as dotenv from 'dotenv';
dotenv.config(); // โหลด .env

export const jwtConstants = {
    secret: process.env.secret,
}