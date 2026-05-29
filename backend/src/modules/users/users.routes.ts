import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware';
import * as controller from './users.controller';

const router = Router();

router.post('/me', authenticate, controller.syncMe);

export default router;
