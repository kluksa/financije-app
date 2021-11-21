import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountType, getAccountTypeIdentifier } from '../account-type.model';

export type EntityResponseType = HttpResponse<IAccountType>;
export type EntityArrayResponseType = HttpResponse<IAccountType[]>;

@Injectable({ providedIn: 'root' })
export class AccountTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accountType: IAccountType): Observable<EntityResponseType> {
    return this.http.post<IAccountType>(this.resourceUrl, accountType, { observe: 'response' });
  }

  update(accountType: IAccountType): Observable<EntityResponseType> {
    return this.http.put<IAccountType>(`${this.resourceUrl}/${getAccountTypeIdentifier(accountType) as number}`, accountType, {
      observe: 'response',
    });
  }

  partialUpdate(accountType: IAccountType): Observable<EntityResponseType> {
    return this.http.patch<IAccountType>(`${this.resourceUrl}/${getAccountTypeIdentifier(accountType) as number}`, accountType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccountTypeToCollectionIfMissing(
    accountTypeCollection: IAccountType[],
    ...accountTypesToCheck: (IAccountType | null | undefined)[]
  ): IAccountType[] {
    const accountTypes: IAccountType[] = accountTypesToCheck.filter(isPresent);
    if (accountTypes.length > 0) {
      const accountTypeCollectionIdentifiers = accountTypeCollection.map(accountTypeItem => getAccountTypeIdentifier(accountTypeItem)!);
      const accountTypesToAdd = accountTypes.filter(accountTypeItem => {
        const accountTypeIdentifier = getAccountTypeIdentifier(accountTypeItem);
        if (accountTypeIdentifier == null || accountTypeCollectionIdentifiers.includes(accountTypeIdentifier)) {
          return false;
        }
        accountTypeCollectionIdentifiers.push(accountTypeIdentifier);
        return true;
      });
      return [...accountTypesToAdd, ...accountTypeCollection];
    }
    return accountTypeCollection;
  }
}
