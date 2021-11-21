import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountt, getAccounttIdentifier } from '../accountt.model';

export type EntityResponseType = HttpResponse<IAccountt>;
export type EntityArrayResponseType = HttpResponse<IAccountt[]>;

@Injectable({ providedIn: 'root' })
export class AccounttService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/accountts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountt: IAccountt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountt);
    return this.http
      .post<IAccountt>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(accountt: IAccountt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountt);
    return this.http
      .put<IAccountt>(`${this.resourceUrl}/${getAccounttIdentifier(accountt) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(accountt: IAccountt): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountt);
    return this.http
      .patch<IAccountt>(`${this.resourceUrl}/${getAccounttIdentifier(accountt) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAccountt>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAccountt[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccounttToCollectionIfMissing(accounttCollection: IAccountt[], ...accounttsToCheck: (IAccountt | null | undefined)[]): IAccountt[] {
    const accountts: IAccountt[] = accounttsToCheck.filter(isPresent);
    if (accountts.length > 0) {
      const accounttCollectionIdentifiers = accounttCollection.map(accounttItem => getAccounttIdentifier(accounttItem)!);
      const accounttsToAdd = accountts.filter(accounttItem => {
        const accounttIdentifier = getAccounttIdentifier(accounttItem);
        if (accounttIdentifier == null || accounttCollectionIdentifiers.includes(accounttIdentifier)) {
          return false;
        }
        accounttCollectionIdentifiers.push(accounttIdentifier);
        return true;
      });
      return [...accounttsToAdd, ...accounttCollection];
    }
    return accounttCollection;
  }

  protected convertDateFromClient(accountt: IAccountt): IAccountt {
    return Object.assign({}, accountt, {
      creation: accountt.creation?.isValid() ? accountt.creation.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.creation = res.body.creation ? dayjs(res.body.creation) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((accountt: IAccountt) => {
        accountt.creation = accountt.creation ? dayjs(accountt.creation) : undefined;
      });
    }
    return res;
  }
}
