import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, loginInUrl } from '../../env/env.service';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private storage: LocalstorageService) { }

  token = this.storage.getItem('token')
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`, // Attach token to headers
    'Content-Type': 'application/json'
  });

  getAllUsers(): Observable<any> {
    const headers = this.headers
    return this.http.get(`${apiUrl}/users`, { headers })
  }

  updateUserEmail(id: any, data: any): Observable<any> {
    const headers = this.headers
    console.log(typeof (id), "type of id")
    console.log(data)
    return this.http.put(`${apiUrl}/user-email/${id}`, data, { headers });
  }

}
