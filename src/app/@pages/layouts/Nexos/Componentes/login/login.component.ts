import { Component, OnInit, Input, Inject, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { Globals } from '../../interface/globals.model';
import { SignServiceService } from '../../service/sign-service.service';
import { HttpClient } from '@angular/common/http';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { dataResidential } from '../../interface/dataResidential.model';
import Swal from 'sweetalert2';
declare var swal: any;
declare var bootstrap: any;
declare var grecaptcha: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {

  @Input() userAuthentication = {
    key: '',
    document_number: '',
    password: '',
    user: undefined,
    name: ''
  }
  errorMessage: string = null;
  errorActive: boolean = false;
  localStorage: any;
  isLoggedIn: boolean;
  loggedInUser: string;
  id_building: any;
  accept_p = false;
  SistemaOperativo: string;
  mailToConfirm = '';
  mailToSecondLogin = '';
  meeting_id: string;
  customer_id: string;
  residential_data: any;
  modal: any;
  modal2: any;
  nameMeeting: string;
  nameResidential: string;

  constructor(
    private router: Router,
    private config: ConfigurationRestService,
    private route: ActivatedRoute,
    private global: Globals,
    private signService: SignServiceService,
    private httpClient: HttpClient,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
  ) {
    this.storage.remove('units');
    this.storage.remove('residential');
    this.storage.remove('usuario');
    this.storage.remove('token');
    this.id_building = this.route.snapshot.paramMap.get("id");
    this.global.id_conjunto = this.id_building;
    if (this.global.reload_for_recaptcha) {
      location.reload();
    }
    this.httpClient.get(this.config.endpoint4 + 'ApiMeetings/getMeetingDetailsByResidential/' + this.id_building)
      .subscribe(resp => {
        if (resp['success'] == false) {
          this.router.navigate(['']);
        }
        else {
          this.residential_data = resp['content'];
          this.meeting_id = resp['content']['meeting_id'];
          this.nameMeeting = resp['content']['meeting_name'];
          this.nameResidential = resp['content']['residential_name'];
          if (resp['content']['meeting_status'] == '0') {
            this.router.navigate(['previo/' + this.id_building]);
          };
          if (resp['content']['meeting_status'] == '2') {
            this.router.navigate(['finalizado/' + this.id_building]);
          };
          if (resp['content']['meeting_status'] == '1') {
          };
        }

        if (resp['content']['meeting_status'] != '2' && this.global.messageLogin) {
          var imgName = './assets/img/ux2.png';
          if (this.id_building == 154) {
            imgName = './assets/img/logo_1.jpg';
          }
          swal.fire({
            title: 'CONSEJO',
            html: '<p style="text-align: justify; text-justify: inter-word;">Para el correcto funcionamiento de la plataforma le hacemos las siguientes recomendaciones:<br>' +
              '1. Verifique que su equipo tenga micrófono y cámara.<br>' +
              '2. Acepte los permisos de micrófono y cámara.<br>' +
              '3. Lea las políticas de privacidad.<br>' +
              '4. Asegúrese de tener una conexión estable a internet.<br>' +
              '5. Busque un espacio sin demasiado ruido de ambiente.<br>' +
              '6. De ser posible utilice audífonos.<br>' +
              'Gracias.</p>',
            imageUrl: imgName,
            imageWidth: 330,
            // imageHeight: 180,
            imageAlt: 'Custom image',
            confirmButtonColor: '#e56e22',
            cancelButtonText: 'cancelar',
            timer: 30000
          })
          this.global.messageLogin = false;
        }
      });
  }

  ngOnInit() {
    // if (this.id_building == '') {
    //   location.href = 'https://asambleas.grupoempresarialnexos.com/votacionslch/#/login/';
    // }
    // if (this.id_building == '') {
    //   location.href = 'https://asambleas.grupoempresarialnexos.com/votacionslp/#/login/';
    // }
    if (this.id_building == '1613') {
      location.href = 'https://www.alquilersonidoasambleas.com/votacion/#/login/685';
    }
    this.signService.customObservable.subscribe((customer_id) => {
      this.callModalEmail(customer_id);
      swal.close();
    });
    var navInfo = window.navigator.appVersion.toLowerCase();
    var so = 'Sistema Operativo';
    if (navInfo.indexOf('win') != -1) {
      so = 'Windows';
    }
    else if (navInfo.indexOf('linux') != -1) {
      so = 'Linux';
    }
    else if (navInfo.indexOf('mac') != -1) {
      so = 'Macintosh';
    }
    this.SistemaOperativo = so;
  }

  loginNexosGE() {
    if (this.userAuthentication.password.length == 0 || this.userAuthentication.document_number == '' || this.userAuthentication.name == '' || this.userAuthentication.user == undefined) {
      if (Swal) {
        Swal.fire({
          title: '<strong>Atención</strong>',
          type: 'error',
          html: 'Debe diligenciar todos los campos',
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: true,
          confirmButtonText: '<i class="fa fa-thumbs-up"></i> ok',
          cancelButtonText: '<i class="fa fa-thumbs-down"></i> No',
          timer: 10000
        })
      } else {
        if (swal) {
          swal.fire({
            title: '<strong>Atención</strong>',
            type: 'error',
            html: 'Debe diligenciar todos los campos',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: true,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> ok',
            cancelButtonText: '<i class="fa fa-thumbs-down"></i> No',
            timer: 10000
          })
        } else {
          alert('Debe diligenciar todos los campos')
        }
      }

    } else {
      if (this.userAuthentication.user < 100 || this.userAuthentication.user > 999999999999999) {
        if (Swal) {
          Swal.fire({
            title: '<strong>Atención</strong>',
            type: 'error',
            html:
              'El usuario debe tener entre 5 y 15 caracteres',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: true,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> ok',
            cancelButtonText:
              '<i class="fa fa-thumbs-down"></i> No',
            confirmButtonColor: '#e56e22',
            timer: 10000
          })
        } else {
          if (swal) {
            swal.fire({
              title: '<strong>Atención</strong>',
              type: 'error',
              html:
                'El usuario debe tener entre 5 y 15 caracteres',
              showCloseButton: true,
              showCancelButton: false,
              focusConfirm: true,
              confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> ok',
              cancelButtonText:
                '<i class="fa fa-thumbs-down"></i> No',
              confirmButtonColor: '#e56e22',
              timer: 10000
            })
          } else {
            alert('El usuario debe tener entre 5 y 15 caracteres')
          }
        }
      } else {
        if (this.userAuthentication.password.length < 2 || this.userAuthentication.password.length > 15) {
          swal.fire({
            title: '<strong>Atención</strong>',
            type: 'error',
            html:
              'La contraseña debe tener entre 4 y 15 caracteres',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: true,
            confirmButtonText:
              '<i class="fa fa-thumbs-up"></i> ok',
            cancelButtonText:
              '<i class="fa fa-thumbs-down"></i> No',
            timer: 10000
          })
        } else {
          if (this.accept_p === false) {
            swal.fire({
              showConfirmButton: true,
              html:
                '<img src="assets/img/logo.png" style="width: 100px; margin-bottom: 5px">' +
                '<hr style="color: #e56e22">' +
                'Debe aceptar las políticas de seguridad y tratamiento de datos.',
              confirmButtonText: "Aceptar",
              confirmButtonColor: '#e56e22',
              showCloseButton: true,
              timer: 10000
            })
          } else {
            if (grecaptcha.getResponse().length == 0) {
              Swal.fire({
                title: '<strong>Atención</strong>',
                type: 'error',
                html: 'Debe veificar que no es un robot',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> ok',
                cancelButtonText: '<i class="fa fa-thumbs-down"></i> No',
                timer: 10000
              })
            } else {
            swal.fire({
              title: 'Verificando la información...',
              html: '<img src="./assets/img/giphy.gif" width="120px"><br><img src="./assets/img/logo.png" width="80px">',
              timer: 6000,
              showConfirmButton: false
            })
            const formData = new FormData();
            formData.append('key', this.config.key);
            formData.append('document_number', this.userAuthentication.user + '');
            formData.append('password', this.userAuthentication['password']);
            this.signService.signCustomer(formData, this.userAuthentication.name, this.userAuthentication.document_number, this.id_building);
            }
          }
        }
      }
    }
  }

  validateUserSessionByEmail() {
    var iconStatus;
    this.httpClient.get(this.config.endpoint4 + 'ApiUsers/validateUserSession/' + this.customer_id + '/' + this.meeting_id + '/' + this.userAuthentication.name)
      .subscribe(resp => {
        if (resp['success']) {
          var user = {
            'document_number': resp['content']['document_number'],
            'user_id': resp['content']['id']
          }
          let residential = new dataResidential(this.id_building, this.residential_data['residential_name'], this.residential_data['meeting_id'], this.residential_data['meeting_name'], this.residential_data['quorum_real_time'], this.residential_data['show_results']);
          if (resp['content']['is_observer'] == 0) {
            this.storage.set('token', resp['content']['qr_code'].slice(5, 25));
          } else {
            this.storage.set('token', 'AlryUUUdrh3336547811');
          }
          this.storage.set('residential', residential);
          this.storage.set('usuario', user);
          this.storage.set('accepted', '0');
          this.storage.set('token2', resp['content']['token']);
          this.storage.set('observer', resp['content']['is_observer']);
          this.storage.set('moroso', resp['content']['moroso']);
          this.storage.set('speaker', resp['content']['speaker']);
          var formData = new FormData;
          formData.append('key', this.config.key);
          formData.append('id', this.customer_id)
          formData.append('nameRegister', this.userAuthentication.name);
          formData.append('documentRegister', this.userAuthentication.document_number);
          formData.append('present', '0');
          this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((response) => {
            this.router.navigate(['/home/quorum2']);
          });
          if (this.modal) {
            this.modal.hide();
          }
          $('body').removeClass('modal-open');
          $('.modal-backdrop').remove();
        }
        else {
          if (Swal) {
            swal.fire({
              icon: "error",
              text: resp['message'],
              showCancelButton: false,
              showConfirmButton: false,
              showCloseButton: true,
              timer: 20000
            });
          } else {
            if (swal) {
              swal.fire({
                icon: "error",
                text: resp['message'],
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: true,
                timer: 20000
              });
            } else {
              alert(resp['message'])
            }
          }
        }
      });
  }

  callModalEmail(customer_id) {
    this.customer_id = customer_id
    this.modal2 = new bootstrap.Modal(document.getElementById('validateSessionByEmail'), {
      keyboard: false
    });
    if (this.modal2) {
      this.modal2.toggle();
    }
  }

  goToRequestCredentials() {
    this.router.navigate(['SolicitudDeCredenciales/' + this.id_building + '/' + this.meeting_id])
  }

}