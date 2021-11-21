import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountType } from '../account-type.model';

@Component({
  selector: 'jhi-account-type-detail',
  templateUrl: './account-type-detail.component.html',
})
export class AccountTypeDetailComponent implements OnInit {
  accountType: IAccountType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountType }) => {
      this.accountType = accountType;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
