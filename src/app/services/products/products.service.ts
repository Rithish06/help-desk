import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiUrl } from '../../env/env.service';
import { Observable } from 'rxjs';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http : HttpClient, private storage : LocalstorageService) { }

  token : any = this.storage.getItem('token')
  headers : any = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`, // Attach token to headers
    'Content-Type': 'application/json'
  });

  getAllProducts(): Observable<any> {
    const headers = this.headers
    return this.http.get(`${apiUrl}/products`, {headers})
  }

  


}
