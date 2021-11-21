export interface IAccountType {
  id?: number;
  name?: string | null;
}

export class AccountType implements IAccountType {
  constructor(public id?: number, public name?: string | null) {}
}

export function getAccountTypeIdentifier(accountType: IAccountType): number | undefined {
  return accountType.id;
}
