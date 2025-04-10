import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl, loginInUrl } from '../../env/env.service';


@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http : HttpClient) { }

  token = localStorage.getItem('token')
  headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`, // Attach token to headers
    'Content-Type': 'application/json'
  });

  apiUrl : any = apiUrl

  getTicketsById(clientId: any): Observable<any> {
    const headers = this.headers
    return this.http.get(`${apiUrl}/tickets/${clientId}`,  { headers });
  }

  getAllTickets():Observable<any>{
    const headers = this.headers
    return this.http.get(`${apiUrl}/tickets`, {headers})
  }

  createTicket(data:any): Observable<any>{
    return this.http.post(`${apiUrl}/tickets-post`,data,  { withCredentials: true })
  }

  updateComment(comment:any, id:any):Observable<any>{
    return this.http.put(`${apiUrl}/update-comment/${id}`, comment, { withCredentials: true })
  }

}
