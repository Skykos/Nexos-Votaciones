import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from './configuration.rest.service';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class SendMessageService {

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService
    ) {
  }

  ngOnInit() {

  }

  sendMessage(dataMessage, keysession, residential_id) {
    this.httpClient.post(this.config.endpoint4 + 'ApiChat/storeMeetingMessage/' + keysession, dataMessage)
      .subscribe(response => {
        if(response['success'] == false){
          swal.fire({
            title: '<strong>Atención</strong>',
            type: 'error',
            html:
              'El chat se encuentra desactivado',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> ok',
            confirmButtonColor: '#e56e22',
            timer: 10000
          })
        } else {
          if(residential_id == 2606) {
            swal.fire("Alerta", 'Su comentario fue enviado', 'success');
          }
        }
      });
  }
}