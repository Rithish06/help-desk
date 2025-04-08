import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, loginInUrl } from '../../env/env.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

    token = localStorage.getItem('token')
    headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`, // Attach token to headers
      'Content-Type': 'application/json'
    });

    updateUserEmail(id:any, data:any):Observable<any>{
      const headers = this.headers
      console.log(typeof(id), "type of id")
      console.log(data)
      return this.http.put(`${apiUrl}/user-email/${id}`,data, { headers });
    }

}
