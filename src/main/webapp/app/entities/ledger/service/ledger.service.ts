import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILedger, getLedgerIdentifier } from '../ledger.model';

export type EntityResponseType = HttpResponse<ILedger>;
export type EntityArrayResponseType = HttpResponse<ILedger[]>;

@Injectable({ providedIn: 'root' })
export class LedgerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ledgers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ledger: ILedger): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ledger);
    return this.http
      .post<ILedger>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ledger: ILedger): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ledger);
    return this.http
      .put<ILedger>(`${this.resourceUrl}/${getLedgerIdentifier(ledger) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ledger: ILedger): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ledger);
    return this.http
      .patch<ILedger>(`${this.resourceUrl}/${getLedgerIdentifier(ledger) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILedger>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILedger[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLedgerToCollectionIfMissing(ledgerCollection: ILedger[], ...ledgersToCheck: (ILedger | null | undefined)[]): ILedger[] {
    const ledgers: ILedger[] = ledgersToCheck.filter(isPresent);
    if (ledgers.length > 0) {
      const ledgerCollectionIdentifiers = ledgerCollection.map(ledgerItem => getLedgerIdentifier(ledgerItem)!);
      const ledgersToAdd = ledgers.filter(ledgerItem => {
        const ledgerIdentifier = getLedgerIdentifier(ledgerItem);
        if (ledgerIdentifier == null || ledgerCollectionIdentifiers.includes(ledgerIdentifier)) {
          return false;
        }
        ledgerCollectionIdentifiers.push(ledgerIdentifier);
        return true;
      });
      return [...ledgersToAdd, ...ledgerCollection];
    }
    return ledgerCollection;
  }

  protected convertDateFromClient(ledger: ILedger): ILedger {
    return Object.assign({}, ledger, {
      timestamp: ledger.timestamp?.isValid() ? ledger.timestamp.toJSON() : undefined,
      date: ledger.date?.isValid() ? ledger.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? dayjs(res.body.timestamp) : undefined;
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ledger: ILedger) => {
        ledger.timestamp = ledger.timestamp ? dayjs(ledger.timestamp) : undefined;
        ledger.date = ledger.date ? dayjs(ledger.date) : undefined;
      });
    }
    return res;
  }
}
