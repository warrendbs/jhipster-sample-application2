import { IUsers, NewUsers } from './users.model';

export const sampleWithRequiredData: IUsers = {
  id: 3635,
};

export const sampleWithPartialData: IUsers = {
  id: 25014,
  email: 'Forrest_Jaskolski94@hotmail.com',
};

export const sampleWithFullData: IUsers = {
  id: 43110,
  email: 'Brooklyn64@gmail.com',
};

export const sampleWithNewData: NewUsers = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
