import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAccountType, AccountType } from '../account-type.model';
import { AccountTypeService } from '../service/account-type.service';

@Component({
  selector: 'jhi-account-type-update',
  templateUrl: './account-type-update.component.html',
})
export class AccountTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
  });

  constructor(protected accountTypeService: AccountTypeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountType }) => {
      this.updateForm(accountType);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountType = this.createFromForm();
    if (accountType.id !== undefined) {
      this.subscribeToSaveResponse(this.accountTypeService.update(accountType));
    } else {
      this.subscribeToSaveResponse(this.accountTypeService.create(accountType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountType>>): void {
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

  protected updateForm(accountType: IAccountType): void {
    this.editForm.patchValue({
      id: accountType.id,
      name: accountType.name,
    });
  }

  protected createFromForm(): IAccountType {
    return {
      ...new AccountType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
