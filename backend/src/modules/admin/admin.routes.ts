import { Router } from 'express';

import { authenticate, requireAdmin } from '../../middlewares/auth.middleware';
import * as controller from './admin.controller';

const router = Router();

router.get('/shops', authenticate, requireAdmin, controller.getShops);
router.patch('/shops/:id/approval', authenticate, requireAdmin, controller.updateShopApproval);

export default router;
