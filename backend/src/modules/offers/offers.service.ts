import * as repository from "./offers.repository";

export const getOffers = async () => {
  return repository.findMany();
};

export const createOffer = async (data: any) => {
  // validation/business logic here

  return repository.create(data);
};