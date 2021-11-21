export interface ICurrency {
  id?: number;
  code?: string | null;
  name?: string | null;
}

export class Currency implements ICurrency {
  constructor(public id?: number, public code?: string | null, public name?: string | null) {}
}

export function getCurrencyIdentifier(currency: ICurrency): number | undefined {
  return currency.id;
}
