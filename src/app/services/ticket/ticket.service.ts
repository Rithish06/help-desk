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
    return this.http.post(`${this.apiUrl}/${id}/comments`, comment, { withCredentials: true })
  }

  // updateTicketStatus(ticketId: string, payload: any) {
  //   return this.http.put(`${this.apiUrl}/ticket/${ticketId}/update-fields`, payload);
  // }

  updateClientPriority(ticketNumber: string, clientPriority: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-client-priority/${ticketNumber}`, {
      clientPriority,
    });
  }

  updateStatus(ticketNumber: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-status/${ticketNumber}`, {
      status,
    });
  }

  updateAdminStatus(ticketNumber: string, adminStatus: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-admin-status/${ticketNumber}`, {
      adminStatus,
    });
  }

  addComment(ticketId: string, commentData: FormData): Observable<any> {
    console.log(ticketId, "from service");
    return this.http.post(`${apiUrl}/tickets/${ticketId}/comments`, commentData, { withCredentials: true });
  }

  updateClientNotification(ticketId:any): Observable<any>{
    return this.http.put(`${apiUrl}/update-clientNotification/ticket/${ticketId}`, { withCredentials: true })
  }

  updateAdminNotification(ticketId:any): Observable<any>{
    return this.http.put(`${apiUrl}/update-adminNotification/ticket/${ticketId}`, { withCredentials: true })
  }
}
