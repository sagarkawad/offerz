import { Router } from 'express';

import * as controller from './offers.controller';

const router = Router();

router.get('/', controller.getOffers);
router.get('/:id', controller.getOfferById);

export default router;
