jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAccountt, Accountt } from '../accountt.model';
import { AccounttService } from '../service/accountt.service';

import { AccounttRoutingResolveService } from './accountt-routing-resolve.service';

describe('Accountt routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AccounttRoutingResolveService;
  let service: AccounttService;
  let resultAccountt: IAccountt | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(AccounttRoutingResolveService);
    service = TestBed.inject(AccounttService);
    resultAccountt = undefined;
  });

  describe('resolve', () => {
    it('should return IAccountt returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountt = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountt).toEqual({ id: 123 });
    });

    it('should return new IAccountt if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountt = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAccountt).toEqual(new Accountt());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Accountt })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAccountt = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAccountt).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
