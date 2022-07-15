import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from './configuration.rest.service';
import swal, { SweetAlertType } from 'sweetalert2';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class GuardarVotoService {
  data: any;
  id: any;
  profile: string;
  userStorage: any;
  id_vote: any;
  code: string;
  id_user: any;
  token: string;
  id_conjunto: any;
  closeModalVote: any;

  constructor(private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private router: Router,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService) {
    this.userStorage = storage.get('user');
    const residentialStorage = this.storage.get('residential');
    const userStorage = this.storage.get('usuario');
    this.code = residentialStorage['uuid_code'];
    this.id_user = userStorage['user_id'];
    this.token = this.storage.get('token');
    this.id_conjunto = residentialStorage['residential_id'];
    if (this.token == "" || this.token == null || this.token == " " || this.token == undefined || this.token.length != 20) {
      swal.fire("Alerta", 'Su sesion ha sido cerrada por favor intente ingresar de nuevo', 'success');
      this.storage.remove('units');
      this.storage.remove('residential');
      this.storage.remove('usuario');
      this.storage.remove('token');
      this.router.navigate(['/login/' + this.id_conjunto]);
    }
    this.closeModalVote = new EventEmitter;
  }

  ngOnInit() {
  }

  Votesend(vote, id_conjunto_send, token_send, id_user_send, meeting_id_send, show_results, keysession, modal) {
    setTimeout(() => {
      this.Vote(vote, id_conjunto_send, token_send, id_user_send, meeting_id_send, show_results, keysession, modal);
    }, 1 * Math.floor((Math.random() * 300) + 1));
  }

  Vote(vote, id_conjunto_send, token_send, id_user_send, meeting_id_send, show_results, keysession, modal) {
    //Validar que el token exista y sea valido
    this.token = token_send;
    this.id_user = id_user_send;
    this.id_conjunto = id_conjunto_send;
    if (this.token == "" || this.token == null || this.token == " " || this.token == undefined || this.token.length != 20) {
      swal.fire("Alerta", 'Su sesion ha sido cerrada por favor intente ingresar de nuevo', 'success');
      this.storage.remove('units');
      this.storage.remove('residential');
      this.storage.remove('usuario');
      this.storage.remove('token');
      if (modal == '1') {
        this.router.navigate(['/login/' + this.id_conjunto]);
      }
    }
    else {
      //Validar si aun hay una pregunta activa
      this.httpClient.get(this.config.endpoint + 'VotingServices/getActiveVoteOptionByMeeting?key=' + this.config.key + '&meeting_id=' + meeting_id_send)
        .subscribe(resp2 => {
          if (resp2['success'] == true) {
            //validar si ya voto
            this.httpClient.get(this.config.endpoint + 'VotingServices/getResidentVoteStatusByOption?key=' + this.config.key + '&user_id=' + this.id_user + '&voting_header_id=' + resp2['content']['id'])
              .subscribe(resp3 => {
                //no ha votado
                if (resp3['success'] == false) {
                  this.httpClient.post(this.config.endpoint4 + 'ApiVoting/storeResidentVote/' + keysession, vote)
                    .subscribe(data => {
                      if (data['success'] == true) {
                        if (modal == '1') {
                          this.closeModalVote.emit(1);
                        }
                        var mensajeText = "";
                        if (data['message'] == "Su voto no fue guardado. Las unidades que representa ya han sido representadas en esta votación.") {
                          mensajeText = "Usted no puede participar en esta votación."
                          swal.fire({
                            title: 'Mensaje',
                            text: mensajeText,
                            // icon: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#e56e22',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Ok, ver resultados'
                          }).then((result) => {
                            if (result.value && modal == '1') {
                              this.router.navigate(['/home/resultados2/' + resp2['content']['id']])
                            }
                          })
                        }
                        else {
                          mensajeText = data['message'];
                          swal.fire({
                            title: 'Mensaje',
                            text: mensajeText,
                            confirmButtonColor: '#e56e22',
                            timer: 20000
                          }
                          )
                          if (show_results == '1' && modal == '1') {
                            this.router.navigate(['/home/votaciones2'])
                          }
                          else {
                            this.router.navigate(['/home/resultados2/' + resp2['content']['id']])
                          }
                        }
                        if (document.getElementById('button-vote')) {
                          document.getElementById('button-vote').style.visibility = 'visible';
                        }
                      }
                      else {
                        var iconStatus2: SweetAlertType = 'warning';
                        iconStatus2 = 'warning', this.router.navigate(['/home/votacion2']);
                        swal.fire("Alerta", data['message'], iconStatus2);
                        if (document.getElementById('button-vote')) {
                          document.getElementById('button-vote').style.visibility = 'visible';
                        }
                      }
                    });
                }
                //ya voto
                else {
                  //voto pero aun tiene opciones de voto
                  if (resp3['total_votes'] == "0") {
                    this.httpClient.post(this.config.endpoint4 + 'ApiVoting/storeResidentVote/' + keysession, vote)
                      .subscribe(data => {
                        if (data['success'] == true) {
                          if (modal == '1') {
                            this.closeModalVote.emit(1);
                          }
                          swal.fire({
                            title: 'Mensaje',
                            text: data['message'],
                            // icon: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#e56e22',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Ok, ver resultados',
                          }).then((result) => {
                            if (result.value && modal == '1') {
                              this.router.navigate(['/home/resultados2/' + resp2['content']['id']])
                            }
                          })
                          // }
                          // });
                        }
                        else {
                          var iconStatus2: SweetAlertType = 'warning';
                          if (modal == '1') {
                            iconStatus2 = 'warning', this.router.navigate(['/home/votacion2']);
                            swal.fire("Alerta", data['message'], iconStatus2);
                          }
                        }
                      });
                  }
                  //Ya hizo el total de votos
                  else {
                    var iconStatus2: SweetAlertType = 'warning';
                    if (modal == '1') {
                      iconStatus2 = 'success';
                    } else {
                      iconStatus2 = 'success', this.router.navigate(['/home']);
                    }
                    swal.fire("Alerta", 'Usted ya ha enviado el total de votos permitidos por la opción actualmente activa', iconStatus2);
                  }
                }
              });
          }
          else {
            swal.fire('No hay preguntas activas en este momento');

            if (modal == '1') {
              this.router.navigate(['/home/votaciones2']);
            }
          }
        });
    }
  }
}