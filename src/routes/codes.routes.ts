import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import {
  getAllCodes,
  getCodeById,
  createCode,
  deleteCode
} from '../controllers/codes.controller';

// Tipo personalizado para controladores
type ExpressController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Wrapper que convierte nuestros controladores al formato que espera Express
const wrapAsync = (fn: ExpressController): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const router = Router();

// Definición de rutas con el wrapper
router.get('/', wrapAsync(getAllCodes));
router.get('/:id', wrapAsync(getCodeById));
router.post('/', wrapAsync(createCode));
router.delete('/:id', wrapAsync(deleteCode));

export default router;