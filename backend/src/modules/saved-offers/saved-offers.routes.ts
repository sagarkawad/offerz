import { Router } from 'express';

import { authenticate, requireBuyer } from '../../middlewares/auth.middleware';
import * as controller from './saved-offers.controller';

const router = Router();

router.get('/', authenticate, requireBuyer, controller.getSavedOffers);
router.post('/:offerId', authenticate, requireBuyer, controller.saveOffer);
router.delete('/:offerId', authenticate, requireBuyer, controller.unsaveOffer);

export default router;
