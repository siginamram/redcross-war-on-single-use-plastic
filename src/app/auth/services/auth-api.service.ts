import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private baseApiUrl: string = environment.baseApiUrl; // Base API URL from environment.ts

  constructor(private http: HttpClient) {}

  /**
   * User login API call
   * @param post - Object with login credentials
   * @returns Observable of user response
   */
  userLogin(post: any): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/api/User/userLogin`, post);
  }
  
}
