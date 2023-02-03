import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMSPD } from '../mspd.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mspd.test-samples';

import { MSPDService } from './mspd.service';

const requireRestSample: IMSPD = {
  ...sampleWithRequiredData,
};

describe('MSPD Service', () => {
  let service: MSPDService;
  let httpMock: HttpTestingController;
  let expectedResult: IMSPD | IMSPD[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MSPDService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a MSPD', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mSPD = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mSPD).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MSPD', () => {
      const mSPD = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mSPD).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MSPD', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MSPD', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MSPD', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMSPDToCollectionIfMissing', () => {
      it('should add a MSPD to an empty array', () => {
        const mSPD: IMSPD = sampleWithRequiredData;
        expectedResult = service.addMSPDToCollectionIfMissing([], mSPD);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mSPD);
      });

      it('should not add a MSPD to an array that contains it', () => {
        const mSPD: IMSPD = sampleWithRequiredData;
        const mSPDCollection: IMSPD[] = [
          {
            ...mSPD,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMSPDToCollectionIfMissing(mSPDCollection, mSPD);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MSPD to an array that doesn't contain it", () => {
        const mSPD: IMSPD = sampleWithRequiredData;
        const mSPDCollection: IMSPD[] = [sampleWithPartialData];
        expectedResult = service.addMSPDToCollectionIfMissing(mSPDCollection, mSPD);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mSPD);
      });

      it('should add only unique MSPD to an array', () => {
        const mSPDArray: IMSPD[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mSPDCollection: IMSPD[] = [sampleWithRequiredData];
        expectedResult = service.addMSPDToCollectionIfMissing(mSPDCollection, ...mSPDArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mSPD: IMSPD = sampleWithRequiredData;
        const mSPD2: IMSPD = sampleWithPartialData;
        expectedResult = service.addMSPDToCollectionIfMissing([], mSPD, mSPD2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mSPD);
        expect(expectedResult).toContain(mSPD2);
      });

      it('should accept null and undefined values', () => {
        const mSPD: IMSPD = sampleWithRequiredData;
        expectedResult = service.addMSPDToCollectionIfMissing([], null, mSPD, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mSPD);
      });

      it('should return initial array if no MSPD is added', () => {
        const mSPDCollection: IMSPD[] = [sampleWithRequiredData];
        expectedResult = service.addMSPDToCollectionIfMissing(mSPDCollection, undefined, null);
        expect(expectedResult).toEqual(mSPDCollection);
      });
    });

    describe('compareMSPD', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMSPD(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMSPD(entity1, entity2);
        const compareResult2 = service.compareMSPD(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMSPD(entity1, entity2);
        const compareResult2 = service.compareMSPD(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMSPD(entity1, entity2);
        const compareResult2 = service.compareMSPD(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
