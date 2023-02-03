import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMSPD } from '../mspd.model';
import { MSPDService } from '../service/mspd.service';

@Injectable({ providedIn: 'root' })
export class MSPDRoutingResolveService implements Resolve<IMSPD | null> {
  constructor(protected service: MSPDService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMSPD | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mSPD: HttpResponse<IMSPD>) => {
          if (mSPD.body) {
            return of(mSPD.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
