import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, loginInUrl } from '../../env/env.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private http: HttpClient) { }
  token = localStorage.getItem('token')
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`, // Attach token to headers
    'Content-Type': 'application/json'
  });

  resetPassword(password: any, id: any): Observable<any> {
    const headers = this.headers;
    return this.http.put(`${apiUrl}/reset-password/${id}`, { password }, { headers });
  }
}