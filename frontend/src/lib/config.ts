import dotenv from 'dotenv';
dotenv.config();

export const API_URL = process.env.API_URL || 'http://10.43.101.170:3000/api';
