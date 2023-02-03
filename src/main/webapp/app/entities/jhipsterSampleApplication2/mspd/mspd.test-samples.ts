import { IMSPD, NewMSPD } from './mspd.model';

export const sampleWithRequiredData: IMSPD = {
  id: 74022,
};

export const sampleWithPartialData: IMSPD = {
  id: 39304,
  streetAddress: 'South Circles',
};

export const sampleWithFullData: IMSPD = {
  id: 6288,
  streetAddress: 'transmit access Neck',
  postalCode: 'Branch magenta',
  city: 'Lake Pamelaview',
  stateProvince: 'grey',
};

export const sampleWithNewData: NewMSPD = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
