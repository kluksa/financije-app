import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IAccountt, Accountt } from '../accountt.model';

import { AccounttService } from './accountt.service';

describe('Accountt Service', () => {
  let service: AccounttService;
  let httpMock: HttpTestingController;
  let elemDefault: IAccountt;
  let expectedResult: IAccountt | IAccountt[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccounttService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
      creation: currentDate,
      active: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          creation: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Accountt', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          creation: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creation: currentDate,
        },
        returnedFromService
      );

      service.create(new Accountt()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Accountt', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          creation: currentDate.format(DATE_FORMAT),
          active: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creation: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Accountt', () => {
      const patchObject = Object.assign(
        {
          creation: currentDate.format(DATE_FORMAT),
          active: true,
        },
        new Accountt()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          creation: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Accountt', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
          creation: currentDate.format(DATE_FORMAT),
          active: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          creation: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Accountt', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAccounttToCollectionIfMissing', () => {
      it('should add a Accountt to an empty array', () => {
        const accountt: IAccountt = { id: 123 };
        expectedResult = service.addAccounttToCollectionIfMissing([], accountt);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountt);
      });

      it('should not add a Accountt to an array that contains it', () => {
        const accountt: IAccountt = { id: 123 };
        const accounttCollection: IAccountt[] = [
          {
            ...accountt,
          },
          { id: 456 },
        ];
        expectedResult = service.addAccounttToCollectionIfMissing(accounttCollection, accountt);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Accountt to an array that doesn't contain it", () => {
        const accountt: IAccountt = { id: 123 };
        const accounttCollection: IAccountt[] = [{ id: 456 }];
        expectedResult = service.addAccounttToCollectionIfMissing(accounttCollection, accountt);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountt);
      });

      it('should add only unique Accountt to an array', () => {
        const accounttArray: IAccountt[] = [{ id: 123 }, { id: 456 }, { id: 40927 }];
        const accounttCollection: IAccountt[] = [{ id: 123 }];
        expectedResult = service.addAccounttToCollectionIfMissing(accounttCollection, ...accounttArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountt: IAccountt = { id: 123 };
        const accountt2: IAccountt = { id: 456 };
        expectedResult = service.addAccounttToCollectionIfMissing([], accountt, accountt2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountt);
        expect(expectedResult).toContain(accountt2);
      });

      it('should accept null and undefined values', () => {
        const accountt: IAccountt = { id: 123 };
        expectedResult = service.addAccounttToCollectionIfMissing([], null, accountt, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountt);
      });

      it('should return initial array if no Accountt is added', () => {
        const accounttCollection: IAccountt[] = [{ id: 123 }];
        expectedResult = service.addAccounttToCollectionIfMissing(accounttCollection, undefined, null);
        expect(expectedResult).toEqual(accounttCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
