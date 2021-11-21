jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AccounttService } from '../service/accountt.service';
import { IAccountt, Accountt } from '../accountt.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICurrency } from 'app/entities/currency/currency.model';
import { CurrencyService } from 'app/entities/currency/service/currency.service';
import { IAccountType } from 'app/entities/account-type/account-type.model';
import { AccountTypeService } from 'app/entities/account-type/service/account-type.service';

import { AccounttUpdateComponent } from './accountt-update.component';

describe('Accountt Management Update Component', () => {
  let comp: AccounttUpdateComponent;
  let fixture: ComponentFixture<AccounttUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accounttService: AccounttService;
  let userService: UserService;
  let currencyService: CurrencyService;
  let accountTypeService: AccountTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccounttUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(AccounttUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccounttUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accounttService = TestBed.inject(AccounttService);
    userService = TestBed.inject(UserService);
    currencyService = TestBed.inject(CurrencyService);
    accountTypeService = TestBed.inject(AccountTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const accountt: IAccountt = { id: 456 };
      const user: IUser = { id: 7872 };
      accountt.user = user;

      const userCollection: IUser[] = [{ id: 57345 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Currency query and add missing value', () => {
      const accountt: IAccountt = { id: 456 };
      const currency: ICurrency = { id: 36750 };
      accountt.currency = currency;

      const currencyCollection: ICurrency[] = [{ id: 85449 }];
      jest.spyOn(currencyService, 'query').mockReturnValue(of(new HttpResponse({ body: currencyCollection })));
      const additionalCurrencies = [currency];
      const expectedCollection: ICurrency[] = [...additionalCurrencies, ...currencyCollection];
      jest.spyOn(currencyService, 'addCurrencyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      expect(currencyService.query).toHaveBeenCalled();
      expect(currencyService.addCurrencyToCollectionIfMissing).toHaveBeenCalledWith(currencyCollection, ...additionalCurrencies);
      expect(comp.currenciesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AccountType query and add missing value', () => {
      const accountt: IAccountt = { id: 456 };
      const type: IAccountType = { id: 43621 };
      accountt.type = type;

      const accountTypeCollection: IAccountType[] = [{ id: 12375 }];
      jest.spyOn(accountTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: accountTypeCollection })));
      const additionalAccountTypes = [type];
      const expectedCollection: IAccountType[] = [...additionalAccountTypes, ...accountTypeCollection];
      jest.spyOn(accountTypeService, 'addAccountTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      expect(accountTypeService.query).toHaveBeenCalled();
      expect(accountTypeService.addAccountTypeToCollectionIfMissing).toHaveBeenCalledWith(accountTypeCollection, ...additionalAccountTypes);
      expect(comp.accountTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const accountt: IAccountt = { id: 456 };
      const user: IUser = { id: 35118 };
      accountt.user = user;
      const currency: ICurrency = { id: 52433 };
      accountt.currency = currency;
      const type: IAccountType = { id: 7292 };
      accountt.type = type;

      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(accountt));
      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.currenciesSharedCollection).toContain(currency);
      expect(comp.accountTypesSharedCollection).toContain(type);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Accountt>>();
      const accountt = { id: 123 };
      jest.spyOn(accounttService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountt }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(accounttService.update).toHaveBeenCalledWith(accountt);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Accountt>>();
      const accountt = new Accountt();
      jest.spyOn(accounttService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountt }));
      saveSubject.complete();

      // THEN
      expect(accounttService.create).toHaveBeenCalledWith(accountt);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Accountt>>();
      const accountt = { id: 123 };
      jest.spyOn(accounttService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountt });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accounttService.update).toHaveBeenCalledWith(accountt);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackUserById', () => {
      it('Should return tracked User primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCurrencyById', () => {
      it('Should return tracked Currency primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCurrencyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAccountTypeById', () => {
      it('Should return tracked AccountType primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAccountTypeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
