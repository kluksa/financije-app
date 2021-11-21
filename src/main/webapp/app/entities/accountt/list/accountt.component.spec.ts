import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccounttService } from '../service/accountt.service';

import { AccounttComponent } from './accountt.component';

describe('Accountt Management Component', () => {
  let comp: AccounttComponent;
  let fixture: ComponentFixture<AccounttComponent>;
  let service: AccounttService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccounttComponent],
    })
      .overrideTemplate(AccounttComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccounttComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccounttService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.accountts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
