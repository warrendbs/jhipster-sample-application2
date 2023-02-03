import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MSPDFormService } from './mspd-form.service';
import { MSPDService } from '../service/mspd.service';
import { IMSPD } from '../mspd.model';
import { IMachine } from 'app/entities/jhipsterSampleApplication2/machine/machine.model';
import { MachineService } from 'app/entities/jhipsterSampleApplication2/machine/service/machine.service';

import { MSPDUpdateComponent } from './mspd-update.component';

describe('MSPD Management Update Component', () => {
  let comp: MSPDUpdateComponent;
  let fixture: ComponentFixture<MSPDUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mSPDFormService: MSPDFormService;
  let mSPDService: MSPDService;
  let machineService: MachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MSPDUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MSPDUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MSPDUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mSPDFormService = TestBed.inject(MSPDFormService);
    mSPDService = TestBed.inject(MSPDService);
    machineService = TestBed.inject(MachineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Machine query and add missing value', () => {
      const mSPD: IMSPD = { id: 456 };
      const machine: IMachine = { id: 81152 };
      mSPD.machine = machine;

      const machineCollection: IMachine[] = [{ id: 62336 }];
      jest.spyOn(machineService, 'query').mockReturnValue(of(new HttpResponse({ body: machineCollection })));
      const additionalMachines = [machine];
      const expectedCollection: IMachine[] = [...additionalMachines, ...machineCollection];
      jest.spyOn(machineService, 'addMachineToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mSPD });
      comp.ngOnInit();

      expect(machineService.query).toHaveBeenCalled();
      expect(machineService.addMachineToCollectionIfMissing).toHaveBeenCalledWith(
        machineCollection,
        ...additionalMachines.map(expect.objectContaining)
      );
      expect(comp.machinesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mSPD: IMSPD = { id: 456 };
      const machine: IMachine = { id: 73200 };
      mSPD.machine = machine;

      activatedRoute.data = of({ mSPD });
      comp.ngOnInit();

      expect(comp.machinesSharedCollection).toContain(machine);
      expect(comp.mSPD).toEqual(mSPD);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMSPD>>();
      const mSPD = { id: 123 };
      jest.spyOn(mSPDFormService, 'getMSPD').mockReturnValue(mSPD);
      jest.spyOn(mSPDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mSPD });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mSPD }));
      saveSubject.complete();

      // THEN
      expect(mSPDFormService.getMSPD).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mSPDService.update).toHaveBeenCalledWith(expect.objectContaining(mSPD));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMSPD>>();
      const mSPD = { id: 123 };
      jest.spyOn(mSPDFormService, 'getMSPD').mockReturnValue({ id: null });
      jest.spyOn(mSPDService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mSPD: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mSPD }));
      saveSubject.complete();

      // THEN
      expect(mSPDFormService.getMSPD).toHaveBeenCalled();
      expect(mSPDService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMSPD>>();
      const mSPD = { id: 123 };
      jest.spyOn(mSPDService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mSPD });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mSPDService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMachine', () => {
      it('Should forward to machineService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(machineService, 'compareMachine');
        comp.compareMachine(entity, entity2);
        expect(machineService.compareMachine).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
