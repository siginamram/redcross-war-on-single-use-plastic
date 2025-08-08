import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {
 private baseApiUrl: string = environment.baseApiUrl; // Base API URL from environment.ts

  constructor(private http: HttpClient) {}
    //Masters
  // Get all countries
  getAllCountries(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetAllCountries`);
  }

  // Get states by country ID
  getStatesByCountry(countryId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetStatesByCountry/${countryId}`);
  }

  // Get districts by state ID
  getDistrictsByState(stateId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetDistrictsByState/${stateId}`);
  }

  // Get cities by district ID
  getCitiesByDistrict(districtId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetCitiesByDistrict/${districtId}`);
  }

    // Get all Zones
  getZones(cityId: number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetZonesByCity/${cityId}`);
  }

    getSections(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetSections`);
  }

      // Get all Classes
  getClasses(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetClasses`);
  }
  // Get all School Types
  getSchoolTypes(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetSchoolTypes`);
  }
// School API Services

// GET methods
getVolunteers(): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetVolunteers`);
}

getClustersByZone(ZoneId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetClustersByZone/${ZoneId}`);
}

getSchoolsByCluster(ClusterId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetSchoolsByCluster/${ClusterId}`);
}

getSchoolsByVolunteer(VolunteerId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetSchoolsByVolunteer/${VolunteerId}`);
}

getSchoolsByZone(stateId:number,districtId:number,cityId: number,ZoneId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetSchoolsByZone/${stateId}/${districtId}/${cityId}/${ZoneId}`);
}

getStudentsBySchool(SchoolId: number,ClassId :number,SectionId:number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetStudentsBySchool/${SchoolId}/${ClassId}/${SectionId}`);
}

getStudentsByClass(ClassId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetStudentsByClass/${ClassId}`);
}

getStudentsBySection(SectionId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetStudentsBySection/${SectionId}`);
}

  
  GetUsersByCity(stateId:number,districtId:number,cityId: number,ZoneId: number,ClusterId: number,): Observable<any> {
   return this.http.get(`${this.baseApiUrl}/api/User/GetUsersByCity/${stateId}/${districtId}/${cityId}/${ZoneId}/${ClusterId}`);
  }

  UpdateUser(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/User/UpdateUser`, payload, {
    responseType: 'text' as 'json',
  });
 }
 UpdateZone(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/MasterData/UpdateZone`, payload, {
    responseType: 'text' as 'json',
  });
 }
// POST methods with responseType: 'text' as 'json'
updateVolunteer(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/UpdateVolunteer`, payload, {
    responseType: 'text' as 'json',
  });
}

updateCluster(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/UpdateCluster`, payload, {
    responseType: 'text' as 'json',
  });
}

updateSchool(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/UpdateSchool`, payload, {
    responseType: 'text' as 'json',
  });
}

updateStudent(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/UpdateStudent`, payload, {
    responseType: 'text' as 'json',
  });
}

UpdatePlasticCollection(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/UpdatePlasticCollection`, payload, {
    responseType: 'text' as 'json',
  });
}

GetPlasticCollectionsByClass(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/GetPlasticCollectionsByClass`, payload);
}

BulkUploadPlasticCollection(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/BulkUploadPlasticCollection`, payload, {
    responseType: 'text' as 'json',
  });
}

BulkUploadSchool(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/BulkUploadSchool`, payload, {
    responseType: 'text' as 'json',
  });
}

BulkUploadStudent(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/BulkUploadStudent`, payload, {
    responseType: 'text' as 'json',
  });
}

BulkUploadVolunteer(payload: any): Observable<any> {
  return this.http.post(`${this.baseApiUrl}/api/School/BulkUploadVolunteer`, payload, {
    responseType: 'text' as 'json',
  });
}

GetRewardTransaction(StudentId: number): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/School/GetRewardTransaction/${StudentId}`);
}

GetRoles(): Observable<any> {
  return this.http.get(`${this.baseApiUrl}/api/MasterData/GetRoles`);
}

}
