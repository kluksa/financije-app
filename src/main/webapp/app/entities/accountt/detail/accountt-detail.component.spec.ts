import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccounttDetailComponent } from './accountt-detail.component';

describe('Accountt Management Detail Component', () => {
  let comp: AccounttDetailComponent;
  let fixture: ComponentFixture<AccounttDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccounttDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountt: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccounttDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccounttDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountt on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountt).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
