import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MSPDComponent } from './list/mspd.component';
import { MSPDDetailComponent } from './detail/mspd-detail.component';
import { MSPDUpdateComponent } from './update/mspd-update.component';
import { MSPDDeleteDialogComponent } from './delete/mspd-delete-dialog.component';
import { MSPDRoutingModule } from './route/mspd-routing.module';

@NgModule({
  imports: [SharedModule, MSPDRoutingModule],
  declarations: [MSPDComponent, MSPDDetailComponent, MSPDUpdateComponent, MSPDDeleteDialogComponent],
})
export class JhipsterSampleApplication2MSPDModule {}
