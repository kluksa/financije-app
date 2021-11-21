import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LedgerComponent } from './list/ledger.component';
import { LedgerDetailComponent } from './detail/ledger-detail.component';
import { LedgerUpdateComponent } from './update/ledger-update.component';
import { LedgerDeleteDialogComponent } from './delete/ledger-delete-dialog.component';
import { LedgerRoutingModule } from './route/ledger-routing.module';

@NgModule({
  imports: [SharedModule, LedgerRoutingModule],
  declarations: [LedgerComponent, LedgerDetailComponent, LedgerUpdateComponent, LedgerDeleteDialogComponent],
  entryComponents: [LedgerDeleteDialogComponent],
})
export class LedgerModule {}
