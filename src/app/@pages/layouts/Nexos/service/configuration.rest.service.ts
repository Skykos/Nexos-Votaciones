import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationRestService {
  //Produccion
  // endpoint = 'https://votacioneselectronicas.com.co/app-preregistro/';
  // endpoint2 = 'https://votacioneselectronicas.com.co/app-management/';

  //Pruebas
  endpoint = 'https://apiasambleas.grupogift.com/app-preregistro/';
  endpoint2 = 'https://apiasambleas.grupogift.com/app-management/';
  endpoint3 = 'https://apiasambleas.grupogift.com/gestor-v2/';
  endpoint4 = 'https://apiasambleas.grupogift.com/preregistro-v2/';
  endpoint5 = 'https://apiasambleas.grupogift.com/preregistro-test/';
  // endpoint4 = 'https://apiasambleas.grupogift.com/preregistro-test/';
  endpointSocket = 'wss://socket.tetranscribo.com:3000';

  //Tercer server
  // endpoint = 'https://alquilersonidoasambleas.com/app-preregistro/';
  // endpoint2 = 'https://alquilersonidoasambleas.com/app-management/';
  // endpoint3 = 'https://alquilersonidoasambleas.com/gestor-v2/';
  // endpoint4 = 'https://alquilersonidoasambleas.com/preregistro-v2/';
  // endpointSocket = 'wss://socket.tetranscribo.com:3000';

  //cuarto server
  // endpoint = 'https://apiasambleas.grupoempresarialnexos.com/app-preregistro/';
  // endpoint2 = 'https://apiasambleas.grupoempresarialnexos.com/app-management/';
  // endpoint3 = 'https://apiasambleas.grupoempresarialnexos.com/gestor-v2/';
  // endpoint4 = 'https://apiasambleas.grupoempresarialnexos.com/preregistro-v2/';
  // endpointSocket = 'wss://socket.grupoempresarialnexos.com:3000';

  //Key
  key = 'GiUBniR9UtmfKDaeOc9tXKt16lk=';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor() { }
}