import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMSPD } from '../mspd.model';
import { MSPDService } from '../service/mspd.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mspd-delete-dialog.component.html',
})
export class MSPDDeleteDialogComponent {
  mSPD?: IMSPD;

  constructor(protected mSPDService: MSPDService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mSPDService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
