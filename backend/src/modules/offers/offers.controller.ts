import { Request, Response } from "express";
import * as service from "./offers.service";

export const getOffers = async (
  req: Request,
  res: Response
) => {
  const offers = await service.getOffers();

  res.json({
    success: true,
    data: offers,
  });
};

export const createOffer = async (
  req: Request,
  res: Response
) => {
  const offer = await service.createOffer(req.body);

  res.status(201).json({
    success: true,
    data: offer,
  });
};