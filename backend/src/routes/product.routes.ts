import { Router } from 'express';
import { listProducts, getProductStats } from '../controllers/product.controller';

const router = Router();

router.get('/', listProducts);
router.get('/stats', getProductStats);

export default router;
