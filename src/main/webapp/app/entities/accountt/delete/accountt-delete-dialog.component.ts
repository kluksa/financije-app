import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountt } from '../accountt.model';
import { AccounttService } from '../service/accountt.service';

@Component({
  templateUrl: './accountt-delete-dialog.component.html',
})
export class AccounttDeleteDialogComponent {
  accountt?: IAccountt;

  constructor(protected accounttService: AccounttService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accounttService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
