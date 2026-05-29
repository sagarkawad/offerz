import { Router } from 'express';

import categoriesRoutes from '../modules/categories/categories.routes';
import locationsRoutes from '../modules/locations/locations.routes';
import offersRoutes from '../modules/offers/offers.routes';
import savedOffersRoutes from '../modules/saved-offers/saved-offers.routes';
import shopsRoutes from '../modules/shops/shops.routes';
import usersRoutes from '../modules/users/users.routes';

const router = Router();

router.use('/locations', locationsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/shops', shopsRoutes);
router.use('/offers', offersRoutes);
router.use('/users', usersRoutes);
router.use('/saved-offers', savedOffersRoutes);

export default router;
