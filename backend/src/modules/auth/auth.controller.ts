import { Request, Response, NextFunction } from 'express';
import * as service from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        const user = await service.register(username, email, password);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await service.login(email, password);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}