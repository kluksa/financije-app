import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccountType } from '../account-type.model';
import { AccountTypeService } from '../service/account-type.service';
import { AccountTypeDeleteDialogComponent } from '../delete/account-type-delete-dialog.component';

@Component({
  selector: 'jhi-account-type',
  templateUrl: './account-type.component.html',
})
export class AccountTypeComponent implements OnInit {
  accountTypes?: IAccountType[];
  isLoading = false;

  constructor(protected accountTypeService: AccountTypeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accountTypeService.query().subscribe(
      (res: HttpResponse<IAccountType[]>) => {
        this.isLoading = false;
        this.accountTypes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAccountType): number {
    return item.id!;
  }

  delete(accountType: IAccountType): void {
    const modalRef = this.modalService.open(AccountTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accountType = accountType;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
