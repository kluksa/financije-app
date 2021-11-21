import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILedger } from '../ledger.model';
import { LedgerService } from '../service/ledger.service';

@Component({
  templateUrl: './ledger-delete-dialog.component.html',
})
export class LedgerDeleteDialogComponent {
  ledger?: ILedger;

  constructor(protected ledgerService: LedgerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ledgerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
