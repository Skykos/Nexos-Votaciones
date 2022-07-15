import { Component, OnInit, Inject } from '@angular/core';
import { GuardarVotoService } from '../../service/guardarvoto.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';

@Component({
  selector: 'app-votacion2',
  templateUrl: './votacion2.component.html',
  styleUrls: ['./votacion2.component.scss']
})
export class Votacion2Component implements OnInit {

  residential_id: any;
  id_user: any;
  code: string;
  vote_name: string;
  vote_resp: any;
  meeting_id: any;
  token: any;
  voting_option = '';
  success = false;
  id_vote: any;
  id_votes: any;
  interval: any;
  status_vote: any;
  document_number: string;
  voting_option_2: [] = [];
  cantidad_votos: any;
  voting_option_send = '';
  show_results: string;
  keysession: string;

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private router: Router,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private guardarVotoService: GuardarVotoService
  ) {
    this.router.errorHandler = (error: any) => { }
    const observerStorage = this.storage.get('observer');
    const moroso = this.storage.get('moroso');
    const userStorage = this.storage.get('usuario');
    const tokenStorage = this.storage.get('token');
    const residentialStorage = this.storage.get('residential');
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
    this.residential_id = residentialStorage['residential_id'];
    this.id_user = userStorage['user_id'];
    this.meeting_id = residentialStorage['meeting_id'];
    this.show_results = residentialStorage['show_results'];
    this.token = tokenStorage;
    this.document_number = userStorage['document_number'];
    this.keysession = this.storage.get('token2');

    if (observerStorage == "1" || moroso == "1") {

      this.router.navigate(['home/votaciones2']);
    }
    else {
      this.httpClient.get(this.config.endpoint + 'VotingServices/getActiveVoteOptionByMeeting?key=' + this.config.key + '&meeting_id=' + this.meeting_id)
        .subscribe(resp2 => {
          if (resp2['success'] == true) {
            this.cantidad_votos = resp2['content']['request_accepted'];
            this.httpClient.get(this.config.endpoint4 + 'ApiVoting/getResidentVoteStatusByOption/' + this.keysession + '/' + resp2['content']['id'])
              .subscribe(resp3 => {
                if (resp3['success'] == true) {
                  if (this.show_results == '1') {
                    this.router.navigate(['home/votaciones2']);
                  }
                  else {
                    this.router.navigate(['/home/resultados2/' + resp2['content']['id']]);
                  }
                }
                else {
                  this.success = true;
                  this.vote_name = resp2['content']['name'];
                  this.vote_resp = resp2['content']['options'];
                  this.id_vote = resp2['content']['id'];
                }
              });
          }
          else {
            this.vote_name = 'En este momento no hay votaciones activas';
          }
        });
    }
    $('#0').removeClass("active");
    $('#1').removeClass("active");
    $('#2').removeClass("active");
    $('#3').addClass("active");
    $('#4').removeClass("active");
    $('#5').removeClass("active");
    $('#6').removeClass("active");

  }

  ngOnInit() {
    this.interval = setTimeout(function () {
      (<HTMLInputElement>document.getElementById('boton')).click();
    }, 2000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  guardarVoto() {
    document.getElementById('button-vote').style.visibility = 'hidden';
    swal.fire({
      title: 'Enviando votación...',
      html: '<img src="./assets/img/giphy.gif" width="120px"><br><img src="./assets/img/logo.png" width="80px">',
      timer: 6000,
      showConfirmButton: false
    })

    if (this.cantidad_votos == 1) {
      var option = [this.voting_option];
      this.voting_option_send = JSON.stringify(option)
      const formData = new FormData();
      formData.append('token', this.token);
      formData.append('source', "website");
      formData.append('meeting_id', this.meeting_id);
      formData.append('voting_options_id', this.voting_option_send);
      this.guardarVotoService.Votesend(formData, this.residential_id, this.token, this.id_user, this.meeting_id, this.show_results, this.keysession, '0');
    } else {
      var data = this.vote_resp.filter(opt => opt.checked).map(opt => opt.id)
      if (data.length < this.cantidad_votos) {
        var html = "Usted ha seleccionado " + data.length + " opciones de las  " + this.cantidad_votos + " opciones posibles, ¿Está seguro de enviar su voto?"
        swal.fire({
          html: html,
          showCancelButton: true,
          confirmButtonColor: '#e56e22',
          cancelButtonColor: '#262626',
          confirmButtonText: 'Sí, enviar voto',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            if (data.length == 0) {
              var option = [""];
              this.voting_option_send = JSON.stringify(option)
            } else {
              this.voting_option_send = JSON.stringify(data)
              const formData = new FormData();
              formData.append('token', this.token);
              formData.append('source', "website");
              formData.append('meeting_id', this.meeting_id);
              formData.append('voting_options_id', this.voting_option_send);
              this.guardarVotoService.Votesend(formData, this.residential_id, this.token, this.id_user, this.meeting_id, this.show_results, this.keysession, '0');
            }
          } else {
            document.getElementById('button-vote').style.visibility = 'visible';
          }
        })
      } else {
        if (data.length == 0) {
          var option = [""];
          this.voting_option_send = JSON.stringify(option)
        } else {
          this.voting_option_send = JSON.stringify(data)
          const formData = new FormData();
          formData.append('token', this.token);
          formData.append('source', "website");
          formData.append('meeting_id', this.meeting_id);
          formData.append('user_id', this.id_user);
          formData.append('voting_options_id', this.voting_option_send);
          this.guardarVotoService.Votesend(formData, this.residential_id, this.token, this.id_user, this.meeting_id, this.show_results, this.keysession, '0');
        }
      }
    }
  }

  Irvotaciones() {
    this.router.navigate(['home/votaciones2']);
  }

  selectedOptions(id_selected) {
    async function disableChecks(cantidad_votos, vote_resp) {
      if (cantidad_votos == data.length) {
        for (let index = 0; index < data.length; index++) {
          for (let index2 = 0; index2 < vote_resp.length; index2++) {
            if (vote_resp[index2]['id'] != data[index]) {
              document.getElementById(vote_resp[index2]['id']).setAttribute("disabled", 'disabled');
            }
          }
        }
      } else {
        for (let index2 = 0; index2 < vote_resp.length; index2++) {
          document.getElementById(vote_resp[index2]['id']).removeAttribute("disabled");
        }
      }
    }

    if (this.cantidad_votos > 1) {
      var data = this.vote_resp.filter(opt => opt.checked).map(opt => opt.id)
      disableChecks(this.cantidad_votos, this.vote_resp).then((value) => {
        for (let index3 = 0; index3 < data.length; index3++) {
          document.getElementById(data[index3]).removeAttribute("disabled");
        }
      })
    }
  }

  reloadVote() {
    this.httpClient.get(this.config.endpoint + 'VotingServices/getActiveVoteOptionByMeeting?key=' + this.config.key + '&meeting_id=' + this.meeting_id)
      .subscribe(resp2 => {
        if (resp2['success'] == true) {
          this.cantidad_votos = resp2['content']['request_accepted'];
          this.httpClient.get(this.config.endpoint4 + 'ApiVoting/getResidentVoteStatusByOption/' + this.keysession + '/' + resp2['content']['id'])
          .subscribe(resp3 => {
              if (resp3['success'] == true) {
                if (this.show_results == '1') {
                  this.router.navigate(['home/votaciones2']);
                }
                else {
                  this.router.navigate(['/home/resultados2/' + resp2['content']['id']]);
                }
              }
              else {
                this.success = true;
                this.vote_name = resp2['content']['name'];
                this.vote_resp = resp2['content']['options'];
                this.id_vote = resp2['content']['id'];
              }
            });
        }
        else {
          this.vote_name = 'En este momento no hay votaciones activas';
        }
      });
  }
}