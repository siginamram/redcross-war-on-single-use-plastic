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

  // Get dashboard data
  GetSchoolDashboard(fdate: string,tdate: string,SchoolId:number): Observable<any> {
    return this.http.get(`${this.baseApiUrl}/api/Dashboard/GetSchoolDashboard/${fdate}/${tdate}/${SchoolId}`);
  } 
}
