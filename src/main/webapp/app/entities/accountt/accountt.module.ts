import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccounttComponent } from './list/accountt.component';
import { AccounttDetailComponent } from './detail/accountt-detail.component';
import { AccounttUpdateComponent } from './update/accountt-update.component';
import { AccounttDeleteDialogComponent } from './delete/accountt-delete-dialog.component';
import { AccounttRoutingModule } from './route/accountt-routing.module';

@NgModule({
  imports: [SharedModule, AccounttRoutingModule],
  declarations: [AccounttComponent, AccounttDetailComponent, AccounttUpdateComponent, AccounttDeleteDialogComponent],
  entryComponents: [AccounttDeleteDialogComponent],
})
export class AccounttModule {}
