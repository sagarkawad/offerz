import { Router } from 'express';

import { authenticate, requireShopkeeper } from '../../middlewares/auth.middleware';
import { ensureShopOwner } from '../../middlewares/shop.middleware';
import * as controller from './shops.controller';

const router = Router();

router.post('/', authenticate, requireShopkeeper, controller.createShop);
router.get('/mine', authenticate, requireShopkeeper, controller.getMyShops);

router.get(
  '/:shopId/offers',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.getShopOffers,
);

router.post(
  '/:shopId/offers',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.createOffer,
);

router.patch(
  '/:shopId/offers/:offerId',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.updateOffer,
);

router.delete(
  '/:shopId/offers/:offerId',
  authenticate,
  requireShopkeeper,
  ensureShopOwner,
  controller.deleteOffer,
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
