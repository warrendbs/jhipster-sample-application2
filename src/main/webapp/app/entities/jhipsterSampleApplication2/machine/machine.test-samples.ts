import { IMachine, NewMachine } from './machine.model';

export const sampleWithRequiredData: IMachine = {
  id: 87927,
};

export const sampleWithPartialData: IMachine = {
  id: 65171,
};

export const sampleWithFullData: IMachine = {
  id: 95112,
};

export const sampleWithNewData: NewMachine = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
