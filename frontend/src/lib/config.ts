import dotenv from 'dotenv';
dotenv.config();

export const API_URL = process.env.API_URL || 'http://backend-service:3000/api';
