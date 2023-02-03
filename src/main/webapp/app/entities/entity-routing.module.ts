import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'machine',
        data: { pageTitle: 'Machines' },
        loadChildren: () =>
          import('./jhipsterSampleApplication2/machine/machine.module').then(m => m.JhipsterSampleApplication2MachineModule),
      },
      {
        path: 'users',
        data: { pageTitle: 'Users' },
        loadChildren: () => import('./jhipsterSampleApplication2/users/users.module').then(m => m.JhipsterSampleApplication2UsersModule),
      },
      {
        path: 'mspd',
        data: { pageTitle: 'MSPDS' },
        loadChildren: () => import('./jhipsterSampleApplication2/mspd/mspd.module').then(m => m.JhipsterSampleApplication2MSPDModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
