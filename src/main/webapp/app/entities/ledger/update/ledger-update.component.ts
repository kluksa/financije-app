import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ILedger, Ledger } from '../ledger.model';
import { LedgerService } from '../service/ledger.service';
import { IAccountt } from 'app/entities/accountt/accountt.model';
import { AccounttService } from 'app/entities/accountt/service/accountt.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

@Component({
  selector: 'jhi-ledger-update',
  templateUrl: './ledger-update.component.html',
})
export class LedgerUpdateComponent implements OnInit {
  isSaving = false;

  accounttsSharedCollection: IAccountt[] = [];
  tagsSharedCollection: ITag[] = [];

  editForm = this.fb.group({
    id: [],
    timestamp: [],
    date: [],
    amount: [],
    creditor: [],
    debitor: [],
    tags: [],
  });

  constructor(
    protected ledgerService: LedgerService,
    protected accounttService: AccounttService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ledger }) => {
      if (ledger.id === undefined) {
        const today = dayjs().startOf('day');
        ledger.timestamp = today;
      }

      this.updateForm(ledger);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ledger = this.createFromForm();
    if (ledger.id !== undefined) {
      this.subscribeToSaveResponse(this.ledgerService.update(ledger));
    } else {
      this.subscribeToSaveResponse(this.ledgerService.create(ledger));
    }
  }

  trackAccounttById(index: number, item: IAccountt): number {
    return item.id!;
  }

  trackTagById(index: number, item: ITag): number {
    return item.id!;
  }

  getSelectedTag(option: ITag, selectedVals?: ITag[]): ITag {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILedger>>): void {
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

  protected updateForm(ledger: ILedger): void {
    this.editForm.patchValue({
      id: ledger.id,
      timestamp: ledger.timestamp ? ledger.timestamp.format(DATE_TIME_FORMAT) : null,
      date: ledger.date,
      amount: ledger.amount,
      creditor: ledger.creditor,
      debitor: ledger.debitor,
      tags: ledger.tags,
    });

    this.accounttsSharedCollection = this.accounttService.addAccounttToCollectionIfMissing(
      this.accounttsSharedCollection,
      ledger.creditor,
      ledger.debitor
    );
    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing(this.tagsSharedCollection, ...(ledger.tags ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.accounttService
      .query()
      .pipe(map((res: HttpResponse<IAccountt[]>) => res.body ?? []))
      .pipe(
        map((accountts: IAccountt[]) =>
          this.accounttService.addAccounttToCollectionIfMissing(
            accountts,
            this.editForm.get('creditor')!.value,
            this.editForm.get('debitor')!.value
          )
        )
      )
      .subscribe((accountts: IAccountt[]) => (this.accounttsSharedCollection = accountts));

    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing(tags, ...(this.editForm.get('tags')!.value ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }

  protected createFromForm(): ILedger {
    return {
      ...new Ledger(),
      id: this.editForm.get(['id'])!.value,
      timestamp: this.editForm.get(['timestamp'])!.value ? dayjs(this.editForm.get(['timestamp'])!.value, DATE_TIME_FORMAT) : undefined,
      date: this.editForm.get(['date'])!.value,
      amount: this.editForm.get(['amount'])!.value,
      creditor: this.editForm.get(['creditor'])!.value,
      debitor: this.editForm.get(['debitor'])!.value,
      tags: this.editForm.get(['tags'])!.value,
    };
  }
}
