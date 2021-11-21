import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccounttComponent } from '../list/accountt.component';
import { AccounttDetailComponent } from '../detail/accountt-detail.component';
import { AccounttUpdateComponent } from '../update/accountt-update.component';
import { AccounttRoutingResolveService } from './accountt-routing-resolve.service';

const accounttRoute: Routes = [
  {
    path: '',
    component: AccounttComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccounttDetailComponent,
    resolve: {
      accountt: AccounttRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccounttUpdateComponent,
    resolve: {
      accountt: AccounttRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccounttUpdateComponent,
    resolve: {
      accountt: AccounttRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accounttRoute)],
  exports: [RouterModule],
})
export class AccounttRoutingModule {}
