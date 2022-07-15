import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { ConfigurationRestService } from './configuration.rest.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;

  constructor(
    private config: ConfigurationRestService
  ) {
    this.socket = io(this.config.endpointSocket, { transports: ['websocket'] });
  }

  public listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  public removeListen(eventName: string) {
    this.socket.removeAllListeners(eventName);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}

