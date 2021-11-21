import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'tag',
        data: { pageTitle: 'financijeApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'account-type',
        data: { pageTitle: 'financijeApp.accountType.home.title' },
        loadChildren: () => import('./account-type/account-type.module').then(m => m.AccountTypeModule),
      },
      {
        path: 'accountt',
        data: { pageTitle: 'financijeApp.accountt.home.title' },
        loadChildren: () => import('./accountt/accountt.module').then(m => m.AccounttModule),
      },
      {
        path: 'ledger',
        data: { pageTitle: 'financijeApp.ledger.home.title' },
        loadChildren: () => import('./ledger/ledger.module').then(m => m.LedgerModule),
      },
      {
        path: 'currency',
        data: { pageTitle: 'financijeApp.currency.home.title' },
        loadChildren: () => import('./currency/currency.module').then(m => m.CurrencyModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
