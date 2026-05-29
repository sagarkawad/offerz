import prisma from '../../prisma/client';

import { offerInclude } from '../offers/offers.includes';

export const findManyByUserId = async (userId: string) => {
  const savedOffers = await prisma.savedOffer.findMany({
    where: { userId },
    include: {
      offer: {
        include: offerInclude,
      },
    },
    orderBy: { savedAt: 'desc' },
  });

  return savedOffers.map((savedOffer) => savedOffer.offer);
};

export const offerExists = async (offerId: string) => {
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  return Boolean(offer);
};

export const findSavedOffer = async (userId: string, offerId: string) => {
  return prisma.savedOffer.findUnique({
    where: {
      userId_offerId: { userId, offerId },
    },
  });
};

export const create = async (userId: string, offerId: string) => {
  return prisma.savedOffer.create({
    data: { userId, offerId },
  });
};

export const remove = async (userId: string, offerId: string) => {
  return prisma.savedOffer.delete({
    where: {
      userId_offerId: { userId, offerId },
    },
  });
};
