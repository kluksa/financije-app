import * as dayjs from 'dayjs';
import { IAccountt } from 'app/entities/accountt/accountt.model';
import { ITag } from 'app/entities/tag/tag.model';

export interface ILedger {
  id?: number;
  timestamp?: dayjs.Dayjs | null;
  date?: dayjs.Dayjs | null;
  amount?: number | null;
  creditor?: IAccountt | null;
  debitor?: IAccountt | null;
  tags?: ITag[] | null;
}

export class Ledger implements ILedger {
  constructor(
    public id?: number,
    public timestamp?: dayjs.Dayjs | null,
    public date?: dayjs.Dayjs | null,
    public amount?: number | null,
    public creditor?: IAccountt | null,
    public debitor?: IAccountt | null,
    public tags?: ITag[] | null
  ) {}
}

export function getLedgerIdentifier(ledger: ILedger): number | undefined {
  return ledger.id;
}
