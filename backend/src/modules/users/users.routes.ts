import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import * as controller from './users.controller';

const router = Router();

router.get('/me', authenticate, controller.getMe);
router.post('/me', authenticate, controller.syncMe);
router.delete('/me', authenticate, controller.deleteMe);

export default router;
