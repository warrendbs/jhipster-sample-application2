import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMSPD, NewMSPD } from '../mspd.model';

export type PartialUpdateMSPD = Partial<IMSPD> & Pick<IMSPD, 'id'>;

export type EntityResponseType = HttpResponse<IMSPD>;
export type EntityArrayResponseType = HttpResponse<IMSPD[]>;

@Injectable({ providedIn: 'root' })
export class MSPDService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mspds', 'jhipstersampleapplication2');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mSPD: NewMSPD): Observable<EntityResponseType> {
    return this.http.post<IMSPD>(this.resourceUrl, mSPD, { observe: 'response' });
  }

  update(mSPD: IMSPD): Observable<EntityResponseType> {
    return this.http.put<IMSPD>(`${this.resourceUrl}/${this.getMSPDIdentifier(mSPD)}`, mSPD, { observe: 'response' });
  }

  partialUpdate(mSPD: PartialUpdateMSPD): Observable<EntityResponseType> {
    return this.http.patch<IMSPD>(`${this.resourceUrl}/${this.getMSPDIdentifier(mSPD)}`, mSPD, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMSPD>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMSPD[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMSPDIdentifier(mSPD: Pick<IMSPD, 'id'>): number {
    return mSPD.id;
  }

  compareMSPD(o1: Pick<IMSPD, 'id'> | null, o2: Pick<IMSPD, 'id'> | null): boolean {
    return o1 && o2 ? this.getMSPDIdentifier(o1) === this.getMSPDIdentifier(o2) : o1 === o2;
  }

  addMSPDToCollectionIfMissing<Type extends Pick<IMSPD, 'id'>>(
    mSPDCollection: Type[],
    ...mSPDSToCheck: (Type | null | undefined)[]
  ): Type[] {
    const mSPDS: Type[] = mSPDSToCheck.filter(isPresent);
    if (mSPDS.length > 0) {
      const mSPDCollectionIdentifiers = mSPDCollection.map(mSPDItem => this.getMSPDIdentifier(mSPDItem)!);
      const mSPDSToAdd = mSPDS.filter(mSPDItem => {
        const mSPDIdentifier = this.getMSPDIdentifier(mSPDItem);
        if (mSPDCollectionIdentifiers.includes(mSPDIdentifier)) {
          return false;
        }
        mSPDCollectionIdentifiers.push(mSPDIdentifier);
        return true;
      });
      return [...mSPDSToAdd, ...mSPDCollection];
    }
    return mSPDCollection;
  }
}
