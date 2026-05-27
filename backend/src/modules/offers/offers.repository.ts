//database layer here
import prisma from "../../prisma/client";

export const findMany = async () => {
  return prisma.offer.findMany();
};

export const create = async (data: any) => {
  return prisma.offer.create({
    data,
  });
};