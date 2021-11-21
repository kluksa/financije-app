import { ILedger } from 'app/entities/ledger/ledger.model';

export interface ITag {
  id?: number;
  name?: string | null;
  description?: string | null;
  ledgers?: ILedger[] | null;
}

export class Tag implements ITag {
  constructor(public id?: number, public name?: string | null, public description?: string | null, public ledgers?: ILedger[] | null) {}
}

export function getTagIdentifier(tag: ITag): number | undefined {
  return tag.id;
}
