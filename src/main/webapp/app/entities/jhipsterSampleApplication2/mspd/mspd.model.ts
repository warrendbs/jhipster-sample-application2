import { IMachine } from 'app/entities/jhipsterSampleApplication2/machine/machine.model';

export interface IMSPD {
  id: number;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  machine?: Pick<IMachine, 'id'> | null;
}

export type NewMSPD = Omit<IMSPD, 'id'> & { id: null };
