jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILedger, Ledger } from '../ledger.model';
import { LedgerService } from '../service/ledger.service';

import { LedgerRoutingResolveService } from './ledger-routing-resolve.service';

describe('Ledger routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LedgerRoutingResolveService;
  let service: LedgerService;
  let resultLedger: ILedger | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(LedgerRoutingResolveService);
    service = TestBed.inject(LedgerService);
    resultLedger = undefined;
  });

  describe('resolve', () => {
    it('should return ILedger returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLedger = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLedger).toEqual({ id: 123 });
    });

    it('should return new ILedger if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLedger = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLedger).toEqual(new Ledger());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Ledger })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLedger = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLedger).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
