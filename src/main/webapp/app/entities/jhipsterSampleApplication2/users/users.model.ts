import { IMachine } from 'app/entities/jhipsterSampleApplication2/machine/machine.model';

export interface IUsers {
  id: number;
  email?: string | null;
  machines?: Pick<IMachine, 'id'>[] | null;
}

export type NewUsers = Omit<IUsers, 'id'> & { id: null };
