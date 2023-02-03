import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UsersFormService, UsersFormGroup } from './users-form.service';
import { IUsers } from '../users.model';
import { UsersService } from '../service/users.service';
import { IMachine } from 'app/entities/jhipsterSampleApplication2/machine/machine.model';
import { MachineService } from 'app/entities/jhipsterSampleApplication2/machine/service/machine.service';

@Component({
  selector: 'jhi-users-update',
  templateUrl: './users-update.component.html',
})
export class UsersUpdateComponent implements OnInit {
  isSaving = false;
  users: IUsers | null = null;

  machinesSharedCollection: IMachine[] = [];

  editForm: UsersFormGroup = this.usersFormService.createUsersFormGroup();

  constructor(
    protected usersService: UsersService,
    protected usersFormService: UsersFormService,
    protected machineService: MachineService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMachine = (o1: IMachine | null, o2: IMachine | null): boolean => this.machineService.compareMachine(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ users }) => {
      this.users = users;
      if (users) {
        this.updateForm(users);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const users = this.usersFormService.getUsers(this.editForm);
    if (users.id !== null) {
      this.subscribeToSaveResponse(this.usersService.update(users));
    } else {
      this.subscribeToSaveResponse(this.usersService.create(users));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUsers>>): void {
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

  protected updateForm(users: IUsers): void {
    this.users = users;
    this.usersFormService.resetForm(this.editForm, users);

    this.machinesSharedCollection = this.machineService.addMachineToCollectionIfMissing<IMachine>(
      this.machinesSharedCollection,
      ...(users.machines ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.machineService
      .query()
      .pipe(map((res: HttpResponse<IMachine[]>) => res.body ?? []))
      .pipe(
        map((machines: IMachine[]) =>
          this.machineService.addMachineToCollectionIfMissing<IMachine>(machines, ...(this.users?.machines ?? []))
        )
      )
      .subscribe((machines: IMachine[]) => (this.machinesSharedCollection = machines));
  }
}
