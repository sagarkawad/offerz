import { Router } from "express";
import * as controller from "./offers.controller";
import { authenticate } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", controller.getOffers);
router.get("/:id", controller.getOfferById);

router.post(
  "/",
  authenticate,
  controller.createOffer
);

export default router;