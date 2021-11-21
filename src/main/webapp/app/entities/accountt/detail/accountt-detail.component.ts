import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAccountt } from '../accountt.model';

@Component({
  selector: 'jhi-accountt-detail',
  templateUrl: './accountt-detail.component.html',
})
export class AccounttDetailComponent implements OnInit {
  accountt: IAccountt | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountt }) => {
      this.accountt = accountt;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
