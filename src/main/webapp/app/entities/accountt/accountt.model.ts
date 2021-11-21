import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { ICurrency } from 'app/entities/currency/currency.model';
import { IAccountType } from 'app/entities/account-type/account-type.model';

export interface IAccountt {
  id?: number;
  name?: string | null;
  description?: string | null;
  creation?: dayjs.Dayjs | null;
  active?: boolean | null;
  user?: IUser | null;
  currency?: ICurrency | null;
  type?: IAccountType | null;
}

export class Accountt implements IAccountt {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public creation?: dayjs.Dayjs | null,
    public active?: boolean | null,
    public user?: IUser | null,
    public currency?: ICurrency | null,
    public type?: IAccountType | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getAccounttIdentifier(accountt: IAccountt): number | undefined {
  return accountt.id;
}
