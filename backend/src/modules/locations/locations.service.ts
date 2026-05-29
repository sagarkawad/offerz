import * as repository from './locations.repository';

export const getLocations = async () => repository.findAll();
