import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LedgerDetailComponent } from './ledger-detail.component';

describe('Ledger Management Detail Component', () => {
  let comp: LedgerDetailComponent;
  let fixture: ComponentFixture<LedgerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LedgerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ledger: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LedgerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LedgerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ledger on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ledger).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
