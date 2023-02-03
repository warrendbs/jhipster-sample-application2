import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsers } from '../users.model';
import { UsersService } from '../service/users.service';

@Injectable({ providedIn: 'root' })
export class UsersRoutingResolveService implements Resolve<IUsers | null> {
  constructor(protected service: UsersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsers | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((users: HttpResponse<IUsers>) => {
          if (users.body) {
            return of(users.body);
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
