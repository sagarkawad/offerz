import { Router } from 'express';

import { authenticate, requireShopkeeper } from '../../middlewares/auth.middleware';
import { ensureShopOwner } from '../../middlewares/shop.middleware';
import * as controller from './shops.controller';

const router = Router();

router.post('/', authenticate, requireShopkeeper, controller.createShop);
router.get('/mine', authenticate, requireShopkeeper, controller.getMyShops);

router.post(
  '/:shopId/offers',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.createOffer,
);

router.get('/:id', controller.getShopById);
router.patch(
  '/:id',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.updateShop,
);
router.delete(
  '/:id',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.deleteShop,
);

export default router;
