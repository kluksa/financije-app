import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccountt, Accountt } from '../accountt.model';
import { AccounttService } from '../service/accountt.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICurrency } from 'app/entities/currency/currency.model';
import { CurrencyService } from 'app/entities/currency/service/currency.service';
import { IAccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/service/account-type.service';

@Component({
  selector: 'jhi-accountt-update',
  templateUrl: './accountt-update.component.html',
})
export class AccounttUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  currenciesSharedCollection: ICurrency[] = [];
  accountTypesSharedCollection: IAccountType[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: [],
    creation: [],
    active: [],
    user: [],
    currency: [],
    type: [],
  });

  constructor(
    protected accounttService: AccounttService,
    protected userService: UserService,
    protected currencyService: CurrencyService,
    protected accountTypeService: AccountTypeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountt }) => {
      this.updateForm(accountt);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountt = this.createFromForm();
    if (accountt.id !== undefined) {
      this.subscribeToSaveResponse(this.accounttService.update(accountt));
    } else {
      this.subscribeToSaveResponse(this.accounttService.create(accountt));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCurrencyById(index: number, item: ICurrency): number {
    return item.id!;
  }

  trackAccountTypeById(index: number, item: IAccountType): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountt>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(accountt: IAccountt): void {
    this.editForm.patchValue({
      id: accountt.id,
      name: accountt.name,
      description: accountt.description,
      creation: accountt.creation,
      active: accountt.active,
      user: accountt.user,
      currency: accountt.currency,
      type: accountt.type,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, accountt.user);
    this.currenciesSharedCollection = this.currencyService.addCurrencyToCollectionIfMissing(
      this.currenciesSharedCollection,
      accountt.currency
    );
    this.accountTypesSharedCollection = this.accountTypeService.addAccountTypeToCollectionIfMissing(
      this.accountTypesSharedCollection,
      accountt.type
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.currencyService
      .query()
      .pipe(map((res: HttpResponse<ICurrency[]>) => res.body ?? []))
      .pipe(
        map((currencies: ICurrency[]) =>
          this.currencyService.addCurrencyToCollectionIfMissing(currencies, this.editForm.get('currency')!.value)
        )
      )
      .subscribe((currencies: ICurrency[]) => (this.currenciesSharedCollection = currencies));

    this.accountTypeService
      .query()
      .pipe(map((res: HttpResponse<IAccountType[]>) => res.body ?? []))
      .pipe(
        map((accountTypes: IAccountType[]) =>
          this.accountTypeService.addAccountTypeToCollectionIfMissing(accountTypes, this.editForm.get('type')!.value)
        )
      )
      .subscribe((accountTypes: IAccountType[]) => (this.accountTypesSharedCollection = accountTypes));
  }

  protected createFromForm(): IAccountt {
    return {
      ...new Accountt(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      creation: this.editForm.get(['creation'])!.value,
      active: this.editForm.get(['active'])!.value,
      user: this.editForm.get(['user'])!.value,
      currency: this.editForm.get(['currency'])!.value,
      type: this.editForm.get(['type'])!.value,
    };
  }
}
