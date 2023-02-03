import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mspd.test-samples';

import { MSPDFormService } from './mspd-form.service';

describe('MSPD Form Service', () => {
  let service: MSPDFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MSPDFormService);
  });

  describe('Service methods', () => {
    describe('createMSPDFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMSPDFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            machine: expect.any(Object),
          })
        );
      });

      it('passing IMSPD should create a new form with FormGroup', () => {
        const formGroup = service.createMSPDFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            streetAddress: expect.any(Object),
            postalCode: expect.any(Object),
            city: expect.any(Object),
            stateProvince: expect.any(Object),
            machine: expect.any(Object),
          })
        );
      });
    });

    describe('getMSPD', () => {
      it('should return NewMSPD for default MSPD initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMSPDFormGroup(sampleWithNewData);

        const mSPD = service.getMSPD(formGroup) as any;

        expect(mSPD).toMatchObject(sampleWithNewData);
      });

      it('should return NewMSPD for empty MSPD initial value', () => {
        const formGroup = service.createMSPDFormGroup();

        const mSPD = service.getMSPD(formGroup) as any;

        expect(mSPD).toMatchObject({});
      });

      it('should return IMSPD', () => {
        const formGroup = service.createMSPDFormGroup(sampleWithRequiredData);

        const mSPD = service.getMSPD(formGroup) as any;

        expect(mSPD).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMSPD should not enable id FormControl', () => {
        const formGroup = service.createMSPDFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMSPD should disable id FormControl', () => {
        const formGroup = service.createMSPDFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
