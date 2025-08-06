import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseApiUrl: string = environment.baseApiUrl; // Base API URL from environment.ts

  constructor(private http: HttpClient) {}
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


  // Get dashboard data

  GetAdminDashboard(fdate: string,tdate: string,districtId:number,cityId:number,zoneId:number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Dashboard/GetAdminDashboard/${fdate}/${tdate}/${districtId}/${cityId}/${zoneId}`);
  } 

  GetSchoolDashboard(fdate: string,tdate: string,SchoolId:number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Dashboard/GetSchoolDashboard/${fdate}/${tdate}/${SchoolId}`);
  } 

  GetVolunteerDashboard(fdate: string,tdate: string,ClusterId :number,VolunteerId :number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Dashboard/GetVolunteerDashboard/${fdate}/${tdate}/${ClusterId}/${VolunteerId}`); 
  } 


}
