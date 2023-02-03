import { IUsers } from 'app/entities/jhipsterSampleApplication2/users/users.model';

export interface IMachine {
  id: number;
  users?: Pick<IUsers, 'id'>[] | null;
}

export type NewMachine = Omit<IMachine, 'id'> & { id: null };
