import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private readonly SOCKET_URL = 'http://localhost:4000'; // Change to your backend URL
  private ticketNotificationSubject = new Subject<any>();

  constructor() {
    this.initializeSocketConnection();
    // this.setupUnloadHandler(); // Optional: disconnect on tab close
  }

  private initializeSocketConnection(): void {
    if (this.socket && this.socket.connected) {
      console.log('🔁 Socket already connected. Skipping new connection.');
      return;
    }

    this.socket = io(this.SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 5000
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`⚠️ Disconnected: ${reason}`);
    });

    this.socket.on('connect_error', (err) => {
      console.error('🚨 Socket connection error:', err.message);
    });

    this.socket.on('ticketNotification', (data) => {
      console.log('🔔 ticketNotification received:', data);
      this.ticketNotificationSubject.next(data);
    });
  }

  // Observable to subscribe from any component
  public onTicketNotification(): Observable<any> {
    return this.ticketNotificationSubject.asObservable();
  }

  // Manual disconnect (optional, e.g., on logout)
  public disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
      console.log('🔌 Socket manually disconnected');
    }
  }


}
