import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILedger } from '../ledger.model';
import { LedgerService } from '../service/ledger.service';
import { LedgerDeleteDialogComponent } from '../delete/ledger-delete-dialog.component';

@Component({
  selector: 'jhi-ledger',
  templateUrl: './ledger.component.html',
})
export class LedgerComponent implements OnInit {
  ledgers?: ILedger[];
  isLoading = false;

  constructor(protected ledgerService: LedgerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ledgerService.query().subscribe(
      (res: HttpResponse<ILedger[]>) => {
        this.isLoading = false;
        this.ledgers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILedger): number {
    return item.id!;
  }

  delete(ledger: ILedger): void {
    const modalRef = this.modalService.open(LedgerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ledger = ledger;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
