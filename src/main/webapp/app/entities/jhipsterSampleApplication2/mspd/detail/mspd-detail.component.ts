import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMSPD } from '../mspd.model';

@Component({
  selector: 'jhi-mspd-detail',
  templateUrl: './mspd-detail.component.html',
})
export class MSPDDetailComponent implements OnInit {
  mSPD: IMSPD | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mSPD }) => {
      this.mSPD = mSPD;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
