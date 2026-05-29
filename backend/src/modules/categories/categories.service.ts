import * as repository from './categories.repository';

export const getCategories = async () => repository.findAll();
