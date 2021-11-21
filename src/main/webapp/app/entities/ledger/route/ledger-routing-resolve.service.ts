import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILedger, Ledger } from '../ledger.model';
import { LedgerService } from '../service/ledger.service';

@Injectable({ providedIn: 'root' })
export class LedgerRoutingResolveService implements Resolve<ILedger> {
  constructor(protected service: LedgerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILedger> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ledger: HttpResponse<Ledger>) => {
          if (ledger.body) {
            return of(ledger.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ledger());
  }
}
