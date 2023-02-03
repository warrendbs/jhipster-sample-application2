import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMSPD, NewMSPD } from '../mspd.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMSPD for edit and NewMSPDFormGroupInput for create.
 */
type MSPDFormGroupInput = IMSPD | PartialWithRequiredKeyOf<NewMSPD>;

type MSPDFormDefaults = Pick<NewMSPD, 'id'>;

type MSPDFormGroupContent = {
  id: FormControl<IMSPD['id'] | NewMSPD['id']>;
  streetAddress: FormControl<IMSPD['streetAddress']>;
  postalCode: FormControl<IMSPD['postalCode']>;
  city: FormControl<IMSPD['city']>;
  stateProvince: FormControl<IMSPD['stateProvince']>;
  machine: FormControl<IMSPD['machine']>;
};

export type MSPDFormGroup = FormGroup<MSPDFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MSPDFormService {
  createMSPDFormGroup(mSPD: MSPDFormGroupInput = { id: null }): MSPDFormGroup {
    const mSPDRawValue = {
      ...this.getFormDefaults(),
      ...mSPD,
    };
    return new FormGroup<MSPDFormGroupContent>({
      id: new FormControl(
        { value: mSPDRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      streetAddress: new FormControl(mSPDRawValue.streetAddress),
      postalCode: new FormControl(mSPDRawValue.postalCode),
      city: new FormControl(mSPDRawValue.city),
      stateProvince: new FormControl(mSPDRawValue.stateProvince),
      machine: new FormControl(mSPDRawValue.machine),
    });
  }

  getMSPD(form: MSPDFormGroup): IMSPD | NewMSPD {
    return form.getRawValue() as IMSPD | NewMSPD;
  }

  resetForm(form: MSPDFormGroup, mSPD: MSPDFormGroupInput): void {
    const mSPDRawValue = { ...this.getFormDefaults(), ...mSPD };
    form.reset(
      {
        ...mSPDRawValue,
        id: { value: mSPDRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MSPDFormDefaults {
    return {
      id: null,
    };
  }
}
