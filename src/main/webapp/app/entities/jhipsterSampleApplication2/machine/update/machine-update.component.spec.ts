import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MachineFormService } from './machine-form.service';
import { MachineService } from '../service/machine.service';
import { IMachine } from '../machine.model';

import { MachineUpdateComponent } from './machine-update.component';

describe('Machine Management Update Component', () => {
  let comp: MachineUpdateComponent;
  let fixture: ComponentFixture<MachineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let machineFormService: MachineFormService;
  let machineService: MachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MachineUpdateComponent],
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
      .overrideTemplate(MachineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MachineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    machineFormService = TestBed.inject(MachineFormService);
    machineService = TestBed.inject(MachineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const machine: IMachine = { id: 456 };

      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      expect(comp.machine).toEqual(machine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachine>>();
      const machine = { id: 123 };
      jest.spyOn(machineFormService, 'getMachine').mockReturnValue(machine);
      jest.spyOn(machineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: machine }));
      saveSubject.complete();

      // THEN
      expect(machineFormService.getMachine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(machineService.update).toHaveBeenCalledWith(expect.objectContaining(machine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachine>>();
      const machine = { id: 123 };
      jest.spyOn(machineFormService, 'getMachine').mockReturnValue({ id: null });
      jest.spyOn(machineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: machine }));
      saveSubject.complete();

      // THEN
      expect(machineFormService.getMachine).toHaveBeenCalled();
      expect(machineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMachine>>();
      const machine = { id: 123 };
      jest.spyOn(machineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ machine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(machineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
