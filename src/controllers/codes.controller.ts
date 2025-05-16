import { Request, Response, NextFunction } from 'express';
import { db } from '../services/db.service';

export const getAllCodes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const codes = await db.getAllCodes();
    res.status(200).json(codes);
  } catch (error) {
    next(error);
  }
};

export const getCodeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = await db.getCodeById(req.params.id);
    if (code) {
      res.status(200).json(code);
    } else {
      res.status(404).json({ error: 'Código no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};

export const createCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, type } = req.body;
    if (!data || !type) {
      res.status(400).json({ error: 'Los campos data y type son requeridos' });
      return;
    }

    const newCode = await db.createCode(data, type);
    res.status(201).json(newCode);
  } catch (error) {
    next(error);
  }
};

export const deleteCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deleted = await db.deleteCode(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Código no encontrado' });
    }
  } catch (error) {
    next(error);
  }
};