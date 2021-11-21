import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountTypeDetailComponent } from './account-type-detail.component';

describe('AccountType Management Detail Component', () => {
  let comp: AccountTypeDetailComponent;
  let fixture: ComponentFixture<AccountTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountTypeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountType: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccountTypeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccountTypeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountType on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountType).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
