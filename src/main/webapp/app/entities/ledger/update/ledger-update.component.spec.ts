jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LedgerService } from '../service/ledger.service';
import { ILedger, Ledger } from '../ledger.model';
import { IAccountt } from 'app/entities/accountt/accountt.model';
import { AccounttService } from 'app/entities/accountt/service/accountt.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { LedgerUpdateComponent } from './ledger-update.component';

describe('Ledger Management Update Component', () => {
  let comp: LedgerUpdateComponent;
  let fixture: ComponentFixture<LedgerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ledgerService: LedgerService;
  let accounttService: AccounttService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LedgerUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(LedgerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LedgerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ledgerService = TestBed.inject(LedgerService);
    accounttService = TestBed.inject(AccounttService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Accountt query and add missing value', () => {
      const ledger: ILedger = { id: 456 };
      const creditor: IAccountt = { id: 35154 };
      ledger.creditor = creditor;
      const debitor: IAccountt = { id: 99501 };
      ledger.debitor = debitor;

      const accounttCollection: IAccountt[] = [{ id: 86966 }];
      jest.spyOn(accounttService, 'query').mockReturnValue(of(new HttpResponse({ body: accounttCollection })));
      const additionalAccountts = [creditor, debitor];
      const expectedCollection: IAccountt[] = [...additionalAccountts, ...accounttCollection];
      jest.spyOn(accounttService, 'addAccounttToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ledger });
      comp.ngOnInit();

      expect(accounttService.query).toHaveBeenCalled();
      expect(accounttService.addAccounttToCollectionIfMissing).toHaveBeenCalledWith(accounttCollection, ...additionalAccountts);
      expect(comp.accounttsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Tag query and add missing value', () => {
      const ledger: ILedger = { id: 456 };
      const tags: ITag[] = [{ id: 60649 }];
      ledger.tags = tags;

      const tagCollection: ITag[] = [{ id: 14799 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...tags];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ledger });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags);
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ledger: ILedger = { id: 456 };
      const creditor: IAccountt = { id: 6828 };
      ledger.creditor = creditor;
      const debitor: IAccountt = { id: 9888 };
      ledger.debitor = debitor;
      const tags: ITag = { id: 37440 };
      ledger.tags = [tags];

      activatedRoute.data = of({ ledger });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ledger));
      expect(comp.accounttsSharedCollection).toContain(creditor);
      expect(comp.accounttsSharedCollection).toContain(debitor);
      expect(comp.tagsSharedCollection).toContain(tags);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ledger>>();
      const ledger = { id: 123 };
      jest.spyOn(ledgerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ledger });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ledger }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ledgerService.update).toHaveBeenCalledWith(ledger);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ledger>>();
      const ledger = new Ledger();
      jest.spyOn(ledgerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ledger });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ledger }));
      saveSubject.complete();

      // THEN
      expect(ledgerService.create).toHaveBeenCalledWith(ledger);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ledger>>();
      const ledger = { id: 123 };
      jest.spyOn(ledgerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ledger });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ledgerService.update).toHaveBeenCalledWith(ledger);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAccounttById', () => {
      it('Should return tracked Accountt primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccounttById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTagById', () => {
      it('Should return tracked Tag primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTagById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedTag', () => {
      it('Should return option if no Tag is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedTag(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Tag for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedTag(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Tag is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedTag(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
