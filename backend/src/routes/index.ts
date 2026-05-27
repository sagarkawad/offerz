import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import offersRoutes from "../modules/offers/offers.routes";
import usersRoutes from "../modules/users/users.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/offers", offersRoutes);
router.use("/users", usersRoutes);

export default router;