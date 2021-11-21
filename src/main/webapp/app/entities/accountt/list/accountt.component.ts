import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountt } from '../accountt.model';
import { AccounttService } from '../service/accountt.service';
import { AccounttDeleteDialogComponent } from '../delete/accountt-delete-dialog.component';

@Component({
  selector: 'jhi-accountt',
  templateUrl: './accountt.component.html',
})
export class AccounttComponent implements OnInit {
  accountts?: IAccountt[];
  isLoading = false;

  constructor(protected accounttService: AccounttService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accounttService.query().subscribe(
      (res: HttpResponse<IAccountt[]>) => {
        this.isLoading = false;
        this.accountts = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAccountt): number {
    return item.id!;
  }

  delete(accountt: IAccountt): void {
    const modalRef = this.modalService.open(AccounttDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountt = accountt;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
