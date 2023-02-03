import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MSPDComponent } from '../list/mspd.component';
import { MSPDDetailComponent } from '../detail/mspd-detail.component';
import { MSPDUpdateComponent } from '../update/mspd-update.component';
import { MSPDRoutingResolveService } from './mspd-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mSPDRoute: Routes = [
  {
    path: '',
    component: MSPDComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MSPDDetailComponent,
    resolve: {
      mSPD: MSPDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MSPDUpdateComponent,
    resolve: {
      mSPD: MSPDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MSPDUpdateComponent,
    resolve: {
      mSPD: MSPDRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mSPDRoute)],
  exports: [RouterModule],
})
export class MSPDRoutingModule {}
