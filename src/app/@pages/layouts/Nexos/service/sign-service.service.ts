import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from './configuration.rest.service';
import { Router } from '@angular/router';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { UserService } from './user.service';
import { dataResidential } from '../interface/dataResidential.model';
import Swal from 'sweetalert2';
declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class SignServiceService {

  user: any;
  uuid: string;
  token = '';
  meeting_id: string;
  userunits: any;
  customObservable: any;

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private router: Router, @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private userService: UserService
  ) {
    this.customObservable = new EventEmitter<any>();
  }

  signCustomer(datosUsuarios, name, document, id_conjunto) {
    //Validar si la asamblea finalizo
    this.httpClient.get(this.config.endpoint4 + 'ApiMeetings/getMeetingDetailsByResidential/' + id_conjunto)
      .subscribe(response => {
        this.meeting_id = response['content']['meeting_id'];
        this.httpClient.get(this.config.endpoint4 + 'ApiUsers/signInUser/' + datosUsuarios.get('document_number') + '/' + datosUsuarios.get('password') + '/' + this.meeting_id).subscribe((response2) => {
          if (response2['success'] == false) {
            if (response2['message'] == 'Ya posee una sesión abierta, debe validar su correo electrónico para continuar.') {
              this.customObservable.emit(response2['customer_id']);
            } else {
              //Usuario incorrecto
              if (Swal) {
                Swal.fire({
                  title: 'Alerta',
                  text: response2['message'],
                  type: 'warning',
                  confirmButtonColor: "#e56e22",
                  confirmButtonText: 'Aceptar'
                });
              } else {
                if (swal) {
                  swal.fire({
                    title: 'Alerta',
                    text: response2['message'],
                    type: 'warning',
                    confirmButtonColor: "#e56e22",
                    confirmButtonText: 'Aceptar'
                  });
                } else {
                  alert(response2['message']);
                }
              }
            }
          } else {
            if (response2['content']['is_observer'] == 0) {
              this.token = response2['content']['qr_code'];
              this.token = response2['content']['qr_code'].slice(5, 25);
            } else {
              this.token = 'kjhagsjdhsjkajshdju7'
            }
            let residential = new dataResidential(id_conjunto, response['content']['residential_name'],
              response['content']['meeting_id'], response['content']['meeting_name'], response['content']['quorum_real_time'], response['content']['show_results']);
            this.storage.set('residential', residential);
            var user = {
              'user_id': response2['content']['id'],
              'document_number': datosUsuarios.get('document_number')
            }
            this.storage.set('residential', residential);
            this.storage.set('usuario', user);
            this.storage.set('token', this.token);
            this.storage.set('token2', response2['content']['token']);
            this.storage.set('observer', response2['content']['is_observer']);
            this.storage.set('moroso', response2['content']['moroso']);
            this.storage.set('speaker', response2['content']['speaker']);
            this.storage.set('accepted', '0');
            this.userService.updateCustomerDetails(response2['content']['id'], name, document);
            if (response2['content']['is_observer'] == 0) {
              this.userunits = response2['content']['units'];
              var represented_units: string = '';
              this.userunits.forEach((unit: any) => {
                represented_units += unit.sector_name + ' ' + unit.sector_number + '  ' + unit.unit_name + ' ' + unit.unit_number + '<br>';
              });
              if (Swal) {
                Swal.fire({
                  type: 'success',
                  html: '<div class="container">' +
                    '<div class="row">' +
                    '<div class="col-12" style="font-weight: bold; font-size: 25px">' +
                    '¡Correcto!' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-12 mt-4">' +
                    'Bienvenido a la asamblea de ' + response['content']['residential_name'] + '. Su asistencia ha sido registrada de forma correcta. Usted representa:' +
                    '</div>' +
                    '</div>' +
                    '<div class="row">' +
                    '<div class="col-12 mt-4" style="overflow-y: scroll">' +
                    represented_units +
                    '</div>' +
                    '</div>' +
                    '</div>',
                  confirmButtonText: "Cerrar",
                  confirmButtonColor: '#e56e22',
                  showCloseButton: true,
                  timer: 15000
                });
              } else {
                if (swal) {
                  swal.fire({
                    icon: 'success',
                    html: '<div class="container">' +
                      '<div class="row">' +
                      '<div class="col-12" style="font-weight: bold; font-size: 25px">' +
                      '¡Correcto!' +
                      '</div>' +
                      '</div>' +
                      '<div class="row">' +
                      '<div class="col-12 mt-4">' +
                      'Bienvenido a la asamblea de ' + response['content']['residential_name'] + '. Su asistencia ha sido registrada de forma correcta. Usted representa:' +
                      '</div>' +
                      '</div>' +
                      '<div class="row">' +
                      '<div class="col-12 mt-4" style="overflow-y: scroll">' +
                      represented_units +
                      '</div>' +
                      '</div>' +
                      '</div>',
                    confirmButtonText: "Cerrar",
                    confirmButtonColor: '#e56e22',
                    showCloseButton: true,
                    timer: 15000
                  });
                } else {
                  alert(
                    'Bienvenido a la asamblea de ' + response['content']['residential_name'] + '. Su asistencia ha sido registrada de forma correcta.'
                  )
                }
              }

            }
            this.router.navigate(['/home/quorum2']);
          }
        });
      });
  }
}