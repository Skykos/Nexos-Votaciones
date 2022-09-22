import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Globals } from '../../interface/globals.model';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TwitchCallService } from '../../service/twitch-call.service';
import { SocketService } from '../../service/socket.service';
import { GuardarVotoService } from '../../service/guardarvoto.service';

declare var swal: any;
declare var bootstrap: any;
declare var pg: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  residential_id: string;
  youtube_link: string;
  jitsi_link: string;
  videoUrl: any;
  trustedDashboardUrl: SafeUrl;
  url: string;
  code: string;
  user_id: string;
  trustedDashboardUrlyoutube: SafeUrl;
  token: string;
  raisehand_status = 0;
  element: HTMLImageElement;
  raisehand_status_button = 0;
  userName: string;
  interval: any;
  interval2: any;
  isObserver = 0;
  isSpeaker = 0;
  password_meeting: string;
  document_number: string;
  html = '';
  quorum_on_real_time: string;
  isTwitch = false;
  isTwitch2 = false;
  keysession: string;
  meeting_id: string;
  voteData: any;
  modalActive: any;
  myModal: any;
  inIntervetionRoom = false;
  interval3: any;
  st: any;
  mt: any;
  ht: any;
  userunits: any;
  unitsDataBase: [] = [];
  representedcoefficient: number;
  swal: any;
  sectorIndex = '';
  unitIndex = "";
  unitsSector = [];
  accepted: any;
  observer: any;
  volume = 100;
  customObservable2: any;
  mutedStatus = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private global: Globals,
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private sanitizer: DomSanitizer,
    private twitch: TwitchCallService,
    private socketService: SocketService,
    private guardarVoto: GuardarVotoService
  ) {
    this.customObservable2 = new EventEmitter<any>();
    if (global.time == 1) {
      location.reload();
    }

    this.global.reload_for_recaptcha = true;
    const userStorage = this.storage.get('usuario');
    const residentialStorage = this.storage.get('residential');
    this.isObserver = this.storage.get('observer');
    this.isSpeaker = this.storage.get('speaker');
    if (this.storage.get('usuario') == null || this.storage.get('usuario') == undefined || this.storage.get('usuario') == '' ||
      this.storage.get('token') == null || this.storage.get('token') == undefined || this.storage.get('token') == '' ||
      this.storage.get('residential') == null || this.storage.get('residential') == undefined || this.storage.get('residential') == '' ||
      this.storage.get('token2') == null || this.storage.get('token2') == undefined || this.storage.get('token2') == '' ||
      this.storage.get('speaker') == null || this.storage.get('speaker') == undefined ||
      this.storage.get('observer') == null || this.storage.get('observer') == undefined ||
      this.storage.get('moroso') == null || this.storage.get('moroso') == undefined) {
      sessionStorage.clear();
      this.router.navigate(['login/' + this.residential_id]);
    }
    this.token = this.storage.get('token');
    this.residential_id = this.storage.get('residential')['residential_id'];
    this.user_id = this.storage.get('usuario')['user_id'];
    this.document_number = userStorage['document_number'];
    this.quorum_on_real_time = residentialStorage['quorum_real_time'];
    this.meeting_id = residentialStorage['meeting_id'];
    this.keysession = this.storage.get('token2');
    this.accepted = this.storage.get('accepted');
    this.observer = this.storage.get('observer')

    if (this.storage.get('speaker') == 1) {
      this.inIntervetionRoom = true;
    }

    // this.httpClient.get(this.config.endpoint + 'PreRegisterMeetingServices/getMeetingDetails?key=' + this.config.key + '&residential_id=' + this.residential_id)
    this.httpClient.get(this.config.endpoint4 + 'ApiMeetings/getMeetingDetails/' + this.keysession + '/' + this.meeting_id)
      .subscribe(resp2 => {
        if (resp2['success']) {
          this.youtube_link = resp2['content']['youtube_share'];
          this.jitsi_link = resp2['content']['zoom_link'];
          this.password_meeting = resp2['content']['pasword_meeting'];
          if (this.youtube_link.match(/www/gi) == null && this.youtube_link.match(/http/gi) == null) {
            this.isTwitch = true;
            setTimeout(() => {
              this.getVolume();
              setTimeout(() => {
                this.volume = 100;
                this.setVolume();
                setTimeout(() => {
                  this.getMuted();
                }, 3500);
              }, 3000);
            }, 4000);
          }

          if (this.isSpeaker == 1) {
            this.raisehand_status = 1;
            this.interval = setTimeout(() => {
              document.getElementById('jitsi_button').click();
              document.getElementById('meet').style.display = 'block';
              this.isTwitch = false;
            }, 2000);
          }

          this.interval = setTimeout(() => {
            if (this.youtube_link.match(/www/gi) != null || this.youtube_link.match(/http/gi) != null) {
              document.getElementById('youtube_id').setAttribute('src', this.youtube_link);
            } else {
              try {
                this.twitch.twitchInsert(this.youtube_link);
              } catch (error) {

              }
            }
          }, 2000);
          this.httpClient.get(this.config.endpoint + 'ResidentialServices/getCustomerProperties?key=' + this.config.key + '&user_id=' + this.user_id + '&residential_id=' + this.residential_id)
            .subscribe(resp5 => {
              if (resp5['message'] == 'El usuario no tiene propiedades registradas en la base de datos') {
                this.httpClient.get(this.config.endpoint4 + 'ApiUsers/closeSession/' + this.keysession + '/' + this.meeting_id).subscribe((response) => {
                })
                const formData = new FormData();
                formData.append('key', this.config.key);
                formData.append('id', this.user_id)
                formData.append('present', '1');
                this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((user) => {
                  sessionStorage.clear();
                  this.router.navigate(['/login/' + this.residential_id]);
                })
              } else {
                this.userName = resp5['content']['nameRegister'] + ' ' + resp5['content']['properties'][0]['name'];
              }
            });
        } else {
          const formData = new FormData();
          formData.append('key', this.config.key);
          formData.append('id', this.user_id)
          formData.append('present', '1');
          this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((user) => {
            sessionStorage.clear();
            swal.fire({
              icon: 'info',
              html: 'Su sesión ha sido finalizada',
              showCancelButton: false,
              confirmButtonColor: '#e56e22',
              timer: 25000
            });
            setTimeout(() => {
              this.router.navigate(['/login/' + this.residential_id]);
            }, 4000);
          });
        }
      });
  }

  ngOnInit() {
    setTimeout(() => {
      var myModalEl = document.getElementById('exampleModal')
      myModalEl.addEventListener('hidePrevented.bs.modal', function (event) {
        document.getElementsByClassName('modal-backdrop')[0].classList.remove("show");
      })
    }, 5000);
    this.socketService.listen('check_presence_' + this.keysession).subscribe((response) => {
      if (response['time'] < 60) {
        var message = 'Para verificar que usted está presente en este momento, haga clic en el botón Confirmar Presencia. <br> Este mensaje se cerrara en: ';
      } else {
        var message = 'Para verificar que usted está presente en este momento, haga clic en el botón Confirmar Presencia.';
      }
      // var message = 'Para verificar que usted está presente en este momento, haga clic en el botón Confirmar Presencia. <br> Este mensaje se cerrara en: ';
      var timerInterval
      swal.fire({
        icon: 'info',
        html: message + '<br> <b> </b>',
        showCancelButton: false,
        confirmButtonColor: '#e56e22',
        showConfirmButton: true,
        confirmButtonText: 'Confirmar Presencia',
        timer: (response['time'] * 60000),
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          // swal.showLoading()
          if (response['time'] < 60) {
            const b = swal.getHtmlContainer().querySelector('b')
            var hours = Math.floor(response['time'] / 60);
            var min = Math.floor(((response['time'] / 60) - hours) * 60);
            var secs = Math.floor(((((response['time'] / 60) - hours) * 60) - min) * 60);
            timerInterval = setInterval(() => {
              secs--;
              if (secs == -1) {
                secs = 59;
                min--;
                if (min == -1) {
                  min = 59;
                  hours--;
                  if (hours == -1) {
                    swal.close();
                    clearInterval(timerInterval);
                  }
                }
              }
              var hoursShow, minShow, secsShow;
              if (hours < 9) {
                hoursShow = '0' + hours;
              } else {
                hoursShow = '' + hours;
              }
              if (min < 9) {
                minShow = '0' + min;
              } else {
                minShow = '' + min;
              }
              if (secs < 9) {
                secsShow = '0' + secs;
              } else {
                secsShow = '' + secs;
              }
              b.textContent = hoursShow + ':' + minShow + ':' + secsShow;
            }, 1000)
          }
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        if (result.dismiss === swal.DismissReason.timer) {
          this.httpClient.get(this.config.endpoint4 + 'ApiUsers/closeSession/' + this.keysession + '/' + this.meeting_id).subscribe((response) => {
          })
          const formData = new FormData();
          formData.append('key', this.config.key);
          formData.append('id', this.user_id)
          formData.append('present', '1');
          this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((user) => {
            sessionStorage.clear();
            this.router.navigate(['/login/' + this.residential_id]);
          })
        }
        if (result.isConfirmed) {
          this.httpClient.get(this.config.endpoint4 + 'ApiUsers/confirmPresence/' + this.keysession + '/' + this.meeting_id)
            .subscribe(resp5 => {
            });
        }
      });
    });
    this.socketService.listen('property_request_updated_' + this.keysession).subscribe((response) => {
      var icon = 'info'
      var text = ''
      if (response['status'] == '1') {
        icon = 'success';
        text = response['message'] + ' revise su representación, gracias';
      } else {
        icon = 'info';
        text = response['message'];
      }
      swal.fire({
        icon: icon,
        html: text,
        showCancelButton: false,
        confirmButtonColor: '#e56e22',
        timer: 20000
      });
      this.httpClient.get(this.config.endpoint4 + 'ApiUsers/getCustomerPropertiesByMeeting/' + this.keysession + '/' + this.meeting_id)
        .subscribe(response => {
          this.representedcoefficient = 0;
          this.userunits = response['content'];
          for (let index = 0; index < this.userunits.length; index++) {
            if (typeof this.userunits[index]['coefficient'] === 'string') {
              this.userunits[index]['coefficient'] = parseFloat(this.userunits[index]['coefficient'].replace(/,/, '.'));
              this.representedcoefficient += this.userunits[index]['coefficient'];
            } else {
              this.representedcoefficient += this.userunits[index]['coefficient'];
            }
          }
        });
    });
    this.socketService.listen('customer_session_' + this.keysession).subscribe((response) => {
      this.global.messageLogin = false;
      swal.fire({
        icon: 'info',
        html: 'Su sesión se ha abierto en otro lugar por ' + response['user_name'] + ', por favor comuníquese con el soporte telefónico si tiene alguna duda Pbx.: (601)4325200 Opción 2',
        showCancelButton: false,
        confirmButtonColor: '#e56e22',
        timer: 20000
      });
      sessionStorage.clear();
      this.router.navigate(['/login/' + this.residential_id]);
    });
    this.socketService.listen('listen_message_' + this.keysession).subscribe((response) => {
      const formData = new FormData();
      formData.append('key', this.config.key);
      formData.append('id', this.user_id)
      formData.append('present', '1');
      this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((user) => {
        sessionStorage.clear();
        swal.fire({
          icon: 'info',
          html: 'Su sesión ha sido finalizada',
          showCancelButton: false,
          confirmButtonColor: '#e56e22',
          timer: 20000
        });
        setTimeout(() => {
          this.router.navigate(['/login/' + this.residential_id]);
        }, 4000);
      });
    });
    this.socketService.listen('participation_request_' + this.keysession).subscribe((response) => {
      if (this.inIntervetionRoom == false) {
        if (response['status'] == 1) {
          swal.fire({
            html: response['message'],
            showCancelButton: false,
            confirmButtonColor: '#e56e22',
            timer: 7000,
          })
          document.getElementById('jitsi_button').click();
          document.getElementById('meet').style.display = 'block';
          this.isTwitch = false;
          this.raisehand_status_button = 2;
          this.raisehand_status = 1;
          this.interval = setTimeout(() => {
            this.raisehand_status_button = 1
          }, 15000);
          this.inIntervetionRoom = true;
        } else {
          swal.fire({
            html: response['message'],
            showCancelButton: false,
            confirmButtonColor: '#e56e22',
            timer: 7000,
          })
          this.inIntervetionRoom = false;
        }
        this.accepted = '0';
        this.storage.set('accepted', '0');
      }
    });
    this.socketService.listen('voting_activated_' + this.meeting_id).subscribe((response3) => {
      this.voteData = response3;
      this.modalActive = true;
      if (this.observer == 0) {
        this.callModalVote();
        this.customObservable2.emit(response3);
      } else {
        this.router.navigate(['home/votaciones2'])
        swal.fire({
          html: 'Se ha activado una votación',
          showCancelButton: true,
          confirmButtonColor: '#e56e22',
          timer: 25000
        })
      }
    })
    this.modalActive = false;
    this.guardarVoto.closeModalVote.subscribe((response) => {
      if (this.myModal) {
        this.myModal.hide();
      }
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
    });
    this.socketService.listen('check_meeting_time_' + this.meeting_id).subscribe((response3) => {
      if (response3['hours'] == 'd') {
        clearInterval(this.interval3);
        document.getElementById('container_timer').style.visibility = 'hidden';
        if (this.isTwitch) {
          document.getElementById('container_timer_button').style.display = 'none';
        }
      }
      else {
        clearInterval(this.interval3);
        if (this.isTwitch) {
          document.getElementById('container_timer_button').style.display = 'block';
        }
        this.startTimer(response3['hours'], response3['minutes'], response3['seconds']);
      }
    });
    this.socketService.listen('meeting_finished_' + this.meeting_id).subscribe((resp) => {
      swal.fire({
        title: 'Atención',
        html: resp['message'],
        showCancelButton: false,
        confirmButtonColor: '#e56e22',
        confirmButtonText: 'OK',
        timer: 20000
      })
      this.httpClient.get(this.config.endpoint4 + 'ApiUsers/closeSession/' + this.keysession + '/' + this.meeting_id).subscribe((response) => {
      })
      const formData = new FormData();
      formData.append('key', this.config.key);
      formData.append('id', this.user_id)
      formData.append('present', '1');
      this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((user) => {
        sessionStorage.clear();
        this.router.navigate(['/finalizado/' + this.residential_id]);
      });
    });
    this.socketService.listen('voting_finished_' + this.meeting_id).subscribe((resp) => {
      this.myModal.hide();
      swal.fire({
        title: 'Atención',
        html: resp['message'],
        showCancelButton: false,
        confirmButtonColor: '#e56e22',
        confirmButtonText: 'OK',
        timer: 15000
      })
    });
  }

  onActivate(event) {
    window.scroll(110, 110);
  }

  refresh() {
    swal.fire({
      title: '¿Desea finalizar su intervención?”',
      showCancelButton: true,
      confirmButtonColor: '#e56e22',
      cancelButtonColor: '#999',
      confirmButtonText: 'Si',
      cancelButtonText: 'cancelar'
    }).then((result) => {
      if (result.value) {
        location.reload();
      }
    })
  }

  refresh2() {
    location.reload();
  }

  raiseHand(accepted) {
    this.accepted = 1;
    const formData = new FormData();
    formData.append('key', this.config.key);
    formData.append('user_id', this.user_id);
    formData.append('code', this.code);
    this.httpClient.get(this.config.endpoint4 + 'ApiRaisingHands/storeRaisingHands/' + this.keysession + '/' + this.meeting_id + '/' + accepted)
      .subscribe(response => {
        if (accepted == 0) {
          if (response['success'] == false) {
            this.accepted = 0
            swal.fire({
              html: response['message'],
              showCancelButton: false,
              confirmButtonColor: '#e56e22',
            })
          }
          else {
            this.accepted = '3';
            this.storage.set('accepted', '3');
            var myToastEl = document.getElementById('toast-2')
            var toast = new bootstrap.Toast(myToastEl)
            toast.show()
            setTimeout(() => {
              toast.hide();
            }, 4000);
          }
        } else {
          this.accepted = '0';
          this.storage.set('accepted', '0');
          var myToastEl = document.getElementById('toast')
          var toast = new bootstrap.Toast(myToastEl)
          toast.show();
          setTimeout(() => {
            toast.hide();
          }, 4000);
        }
      });
  }

  youtube() {
    this.raisehand_status = 0;
    document.getElementById('jitsiConferenceFrame0').setAttribute('src', this.youtube_link + '?playsinline=1&autoplay=1');
  }

  logOut() {
    swal.fire({
      title: '¿Está seguro de que desea cerrar sesión?”',
      showCancelButton: true,
      confirmButtonColor: '#e56e22',
      cancelButtonColor: '#999',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.httpClient.get(this.config.endpoint4 + 'ApiUsers/closeSession/' + this.keysession + '/' + this.meeting_id).subscribe((response) => {
        })
        const formData = new FormData();
        formData.append('key', this.config.key);
        formData.append('id', this.user_id)
        formData.append('present', '1');
        this.httpClient.post(this.config.endpoint + 'CustomerRegistrationServices/updateCustomerData', formData).subscribe((user) => {
          sessionStorage.clear();
          this.router.navigate(['/login/' + this.residential_id]);
        })
      }
    });
  }


  scrollTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  startTimer(hours, minutes, seconds) {
    document.getElementById('container_timer').style.visibility = 'visible';
    if (seconds > 0 || minutes > 0 || hours > 0) {
      this.interval3 = setInterval(() => {
        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          }
          if (hours > 0 && minutes == 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          }
        }
        if (minutes == 0 && seconds == 0 && hours == 0) {
          clearInterval(this.interval3);
          document.getElementById('container_timer').style.visibility = 'hidden';

        }
        this.st = ('0' + seconds).slice(-2);
        this.mt = ('0' + minutes).slice(-2);
        this.ht = ('0' + hours).slice(-2);
      }, 1000);
    }
  }

  Delete(unitId, index) {
    swal.fire({
      title: '¿Está seguro de que desea renunciar a la representación de esta unidad?',
      showDenyButton: true,
      confirmButtonText: 'Sí, eliminar unidad',
      confirmButtonColor: '#e56e22 ',
      cancelButtontext: 'No eliminar',
      denyButtonColor: '#262626',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.httpClient.get(this.config.endpoint4 + 'ApiUsers/removePropertyByUser/' + this.keysession + '/' + unitId)
          .subscribe((response) => {
            if (response['success']) {
              this.representedcoefficient = 0;
              swal.fire('Unidad eliminada de su representación', '', 'success',);
              this.userunits.splice(index, 1);
              for (let index = 0; index < this.userunits.length; index++) {
                if (typeof this.userunits[index]['coefficient'] === 'string') {
                  this.userunits[index]['coefficient'] = parseFloat(this.userunits[index]['coefficient'].replace(/,/, '.'));
                  this.representedcoefficient += this.userunits[index]['coefficient'];
                } else {
                  this.representedcoefficient += this.userunits[index]['coefficient'];
                }
              }
            } else {
              swal.fire('No se ha realizado ningún cambio', '', 'info')
            }
          });
      } else if (result.isDenied) {
      }
    })
  }

  Save() {
    var sector = this.unitsDataBase[this.sectorIndex];
    var unit = sector['units'][this.unitIndex];
    var unitid = unit['id'];
    this.httpClient.get(this.config.endpoint4 + 'ApiUsers/addNewPropertyByUser/' + this.keysession + '/' + this.meeting_id + '/' + unitid)
      .subscribe((response) => {
        if (response['success']) {
          swal.fire({
            icon: 'success',
            title: '¡Atención!',
            text: 'Se ha enviado una solicitud para adicionar la unidad ' + sector.name + ' ' + sector.number + ' ' + unit.name + ' ' + unit.number + ' a su representación. En un momento recibirá un mensaje con la respuesta a su solicitud.',
            confirmButtonColor: '#e56e22 ',
            confirmButtonText: 'Ok',
            timer: 10000
          })
        } else {
          if (response['message'] == 'No es posible recibir su petición, se ha alcanzado el límite permitido.') {
            swal.fire({
              icon: 'question',
              title: '¡Atención!',
              text: 'No es posible recibir su petición, se ha alcanzado el límite permitido, por favor comuníquese con el soporte técnico',
              confirmButtonColor: '#e56e22 ',
              confirmButtonText: 'Ok',
              timer: 10000
            });
          } else {
            swal.fire({
              icon: 'question',
              title: '¡Atención!',
              text: response['message'],
              confirmButtonColor: '#e56e22 ',
              confirmButtonText: 'Ok',
              timer: 10000
            });
          }
        }
        this.sectorIndex = '';
        this.unitIndex = '';
      });
  }

  getUnitsBySector() {
    this.unitsSector = this.unitsDataBase[this.sectorIndex].units;
  }

  buttonHide() {
    if (document.getElementById("icon-sidebar").style.display == "none") {
      document.getElementById("icon-sidebar").style.display = "inline-block"
    }
  }

  showUnits() {
    pg.removeClass(document.body, "menu-pin");
    pg.removeClass(document.body, "sidebar-open");
    this.representedcoefficient = 0
    this.httpClient.get(this.config.endpoint4 + 'ApiUsers/getCustomerPropertiesByMeeting/' + this.keysession + '/' + this.meeting_id)
      .subscribe(response => {
        this.userunits = response['content'];
        for (let index = 0; index < this.userunits.length; index++) {
          if (typeof this.userunits[index]['coefficient'] === 'string') {
            this.userunits[index]['coefficient'] = parseFloat(this.userunits[index]['coefficient'].replace(/,/, '.'));
            this.representedcoefficient += this.userunits[index]['coefficient'];
          } else {
            this.representedcoefficient += this.userunits[index]['coefficient'];
          }
        }
      });
  }

  navigate(url) {
    if (this.router.url != url) {
      this.buttonHide();
      this.router.navigate([url]);
      if (document.getElementById('votacionReload') && url == 'home/votacion2') {
        document.getElementById('votacionReload').click();
      }
    }
  }

  callModalVote() {
    this.myModal = new bootstrap.Modal(document.getElementById('voteModal'), {
      keyboard: false
    });
    this.myModal.toggle();
  }

  ngOnDestroy() {
    clearInterval(this.interval3);
    this.socketService.removeListen('check_presence_' + this.keysession);
    this.socketService.removeListen('property_request_updated_' + this.keysession);
    this.socketService.removeListen('customer_session_' + this.keysession);
    this.socketService.removeListen('listen_message_' + this.keysession);
    this.socketService.removeListen('participation_request_' + this.keysession);
    this.socketService.removeListen('voting_activated_' + this.meeting_id);
    this.socketService.removeListen('check_meeting_time_' + this.meeting_id);
    this.socketService.removeListen('meeting_finished_' + this.meeting_id);
    this.socketService.removeListen('voting_finished_' + this.meeting_id);
  }

  setVolume() {
    this.twitch.setVolume(this.volume / 100);
  }

  getVolume() {
    this.volume = this.twitch.getVolume() * 100;
  }

  getMuted() {
    this.mutedStatus = this.twitch.getMuted();
    if (this.mutedStatus) {
      this.isTwitch2 = true;
      document.getElementById("twitch").remove();
      setTimeout(() => {
        this.twitch.twitchInsert2(this.youtube_link);
      }, 1000);
    }
  }

  openModalAddunits() {
    this.httpClient.get(this.config.endpoint4 + 'ApiUnits/getBuildingsUnitByMeeting/' + this.keysession + '/' + this.meeting_id)
      .subscribe(resp4 => {
        this.unitsDataBase = resp4['content'];
      });
  }
}