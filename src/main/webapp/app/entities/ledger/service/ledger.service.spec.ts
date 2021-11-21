import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ILedger, Ledger } from '../ledger.model';

import { LedgerService } from './ledger.service';

describe('Ledger Service', () => {
  let service: LedgerService;
  let httpMock: HttpTestingController;
  let elemDefault: ILedger;
  let expectedResult: ILedger | ILedger[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LedgerService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      timestamp: currentDate,
      date: currentDate,
      amount: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Ledger', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new Ledger()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ledger', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          date: currentDate.format(DATE_FORMAT),
          amount: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ledger', () => {
      const patchObject = Object.assign(
        {
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          date: currentDate.format(DATE_FORMAT),
          amount: 1,
        },
        new Ledger()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          timestamp: currentDate,
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ledger', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          date: currentDate.format(DATE_FORMAT),
          amount: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Ledger', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLedgerToCollectionIfMissing', () => {
      it('should add a Ledger to an empty array', () => {
        const ledger: ILedger = { id: 123 };
        expectedResult = service.addLedgerToCollectionIfMissing([], ledger);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ledger);
      });

      it('should not add a Ledger to an array that contains it', () => {
        const ledger: ILedger = { id: 123 };
        const ledgerCollection: ILedger[] = [
          {
            ...ledger,
          },
          { id: 456 },
        ];
        expectedResult = service.addLedgerToCollectionIfMissing(ledgerCollection, ledger);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ledger to an array that doesn't contain it", () => {
        const ledger: ILedger = { id: 123 };
        const ledgerCollection: ILedger[] = [{ id: 456 }];
        expectedResult = service.addLedgerToCollectionIfMissing(ledgerCollection, ledger);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ledger);
      });

      it('should add only unique Ledger to an array', () => {
        const ledgerArray: ILedger[] = [{ id: 123 }, { id: 456 }, { id: 9947 }];
        const ledgerCollection: ILedger[] = [{ id: 123 }];
        expectedResult = service.addLedgerToCollectionIfMissing(ledgerCollection, ...ledgerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ledger: ILedger = { id: 123 };
        const ledger2: ILedger = { id: 456 };
        expectedResult = service.addLedgerToCollectionIfMissing([], ledger, ledger2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ledger);
        expect(expectedResult).toContain(ledger2);
      });

      it('should accept null and undefined values', () => {
        const ledger: ILedger = { id: 123 };
        expectedResult = service.addLedgerToCollectionIfMissing([], null, ledger, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ledger);
      });

      it('should return initial array if no Ledger is added', () => {
        const ledgerCollection: ILedger[] = [{ id: 123 }];
        expectedResult = service.addLedgerToCollectionIfMissing(ledgerCollection, undefined, null);
        expect(expectedResult).toEqual(ledgerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
