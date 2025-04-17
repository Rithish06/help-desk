// notification.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { socketUrl } from '../../env/env.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;

  constructor() {
    this.socket = io(socketUrl); 
  }

  // Listen for specific notification events
  public onNotification(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('notification', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Listen for connection status
  public onConnect(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('connect', () => {
        observer.next(true);
      });
    });
  }

  // Listen for disconnection
  public onDisconnect(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('disconnect', () => {
        observer.next(true);
      });
    });
  }

  // Join a specific room/channel if needed
  public joinRoom(roomId: string): void {
    this.socket.emit('join', roomId);
  }

  // Leave a room/channel if needed
  public leaveRoom(roomId: string): void {
    this.socket.emit('leave', roomId);
  }

  // Disconnect socket when service is destroyed
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}