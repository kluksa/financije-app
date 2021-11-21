import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LedgerService } from '../service/ledger.service';

import { LedgerComponent } from './ledger.component';

describe('Ledger Management Component', () => {
  let comp: LedgerComponent;
  let fixture: ComponentFixture<LedgerComponent>;
  let service: LedgerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LedgerComponent],
    })
      .overrideTemplate(LedgerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LedgerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LedgerService);

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
    expect(comp.ledgers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
