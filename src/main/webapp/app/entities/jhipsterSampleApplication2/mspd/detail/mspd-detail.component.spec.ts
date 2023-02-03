import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MSPDDetailComponent } from './mspd-detail.component';

describe('MSPD Management Detail Component', () => {
  let comp: MSPDDetailComponent;
  let fixture: ComponentFixture<MSPDDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MSPDDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mSPD: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MSPDDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MSPDDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mSPD on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mSPD).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
