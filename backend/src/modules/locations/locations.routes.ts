import { Router } from 'express';

import * as controller from './locations.controller';

const router = Router();

router.get('/', controller.getLocations);

export default router;
