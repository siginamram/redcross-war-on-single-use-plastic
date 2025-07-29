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
  getZones(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetZones`);
  }

      // Get all Classes
  getClasses(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetClasses`);
  }
  // Get all Sections
  getSections(): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/MasterData/GetSections`);
  }
}
