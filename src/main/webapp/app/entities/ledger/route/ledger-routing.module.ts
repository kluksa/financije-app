import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LedgerComponent } from '../list/ledger.component';
import { LedgerDetailComponent } from '../detail/ledger-detail.component';
import { LedgerUpdateComponent } from '../update/ledger-update.component';
import { LedgerRoutingResolveService } from './ledger-routing-resolve.service';

const ledgerRoute: Routes = [
  {
    path: '',
    component: LedgerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LedgerDetailComponent,
    resolve: {
      ledger: LedgerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LedgerUpdateComponent,
    resolve: {
      ledger: LedgerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LedgerUpdateComponent,
    resolve: {
      ledger: LedgerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ledgerRoute)],
  exports: [RouterModule],
})
export class LedgerRoutingModule {}
