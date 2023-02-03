import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MSPDFormService, MSPDFormGroup } from './mspd-form.service';
import { IMSPD } from '../mspd.model';
import { MSPDService } from '../service/mspd.service';
import { IMachine } from 'app/entities/jhipsterSampleApplication2/machine/machine.model';
import { MachineService } from 'app/entities/jhipsterSampleApplication2/machine/service/machine.service';

@Component({
  selector: 'jhi-mspd-update',
  templateUrl: './mspd-update.component.html',
})
export class MSPDUpdateComponent implements OnInit {
  isSaving = false;
  mSPD: IMSPD | null = null;

  machinesSharedCollection: IMachine[] = [];

  editForm: MSPDFormGroup = this.mSPDFormService.createMSPDFormGroup();

  constructor(
    protected mSPDService: MSPDService,
    protected mSPDFormService: MSPDFormService,
    protected machineService: MachineService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMachine = (o1: IMachine | null, o2: IMachine | null): boolean => this.machineService.compareMachine(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mSPD }) => {
      this.mSPD = mSPD;
      if (mSPD) {
        this.updateForm(mSPD);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mSPD = this.mSPDFormService.getMSPD(this.editForm);
    if (mSPD.id !== null) {
      this.subscribeToSaveResponse(this.mSPDService.update(mSPD));
    } else {
      this.subscribeToSaveResponse(this.mSPDService.create(mSPD));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMSPD>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(mSPD: IMSPD): void {
    this.mSPD = mSPD;
    this.mSPDFormService.resetForm(this.editForm, mSPD);

    this.machinesSharedCollection = this.machineService.addMachineToCollectionIfMissing<IMachine>(
      this.machinesSharedCollection,
      mSPD.machine
    );
  }

  protected loadRelationshipsOptions(): void {
    this.machineService
      .query()
      .pipe(map((res: HttpResponse<IMachine[]>) => res.body ?? []))
      .pipe(map((machines: IMachine[]) => this.machineService.addMachineToCollectionIfMissing<IMachine>(machines, this.mSPD?.machine)))
      .subscribe((machines: IMachine[]) => (this.machinesSharedCollection = machines));
  }
}
