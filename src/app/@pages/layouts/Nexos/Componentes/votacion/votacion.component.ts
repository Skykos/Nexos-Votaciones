import { Component, OnInit, Inject, Input } from '@angular/core';
import { GuardarVotoService } from '../../service/guardarvoto.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.scss']
})
export class VotacionComponent implements OnInit {
  @Input() voteData: any;
  @Input() modalActive: any;
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
    private guardarVotoService: GuardarVotoService,
    private dashboard: DashboardComponent
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
  }

  ngOnInit() {
    this.dashboard.customObservable2.subscribe((response) => {
      this.MetodVoteData(response);
    });
  }

  ngOnDestroy() {
  }

  guardarVoto() {
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
      this.guardarVotoService.Votesend(formData, this.residential_id, this.token, this.id_user, this.meeting_id, this.show_results, this.keysession, '1');
    } else {
      var data = this.voteData['options'].filter(opt => opt.checked).map(opt => opt.id)
      if (data.length < this.cantidad_votos) {
        var html = "Usted ha seleccionado " + data.length + " opciones de las " + this.cantidad_votos + " opciones posibles, ¿Está seguro de enviar su voto?"
        swal.fire({
          html: html,
          showCancelButton: true,
          confirmButtonColor: '#e56e22',
          cancelButtonColor: '#262626',
          confirmButtonText: 'Sí, enviar votos',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            if (data.length == 0) {
              var option = [""];
              this.voting_option_send = JSON.stringify(option)
            } else {
              this.voting_option_send = JSON.stringify(data)
              if (this.voting_option_send.length == 4) {
                swal.fire("Alerta", 'Debe seleccionar alguna opcion de voto', 'info');
              }
              else {
                const formData = new FormData();
                formData.append('key', this.config.key);
                formData.append('meeting_id', this.meeting_id);
                formData.append('source', "website");
                formData.append('voting_options_id', this.voting_option_send);
                formData.append('token', this.token);
                this.guardarVotoService.Votesend(formData, this.residential_id, this.token, this.id_user, this.meeting_id, this.show_results, this.keysession, '1');
              }
            }
          } else {
          }
        })
      } else {
        if (data.length == 0) {
          var option = [""];
          this.voting_option_send = JSON.stringify(option)
        } else {
          this.voting_option_send = JSON.stringify(data)

          if (this.voting_option_send.length == 4) {
            swal.fire("Alerta", 'Debe seleccionar alguna opcion de voto', 'info');
          }
          else {
            const formData = new FormData();
            formData.append('token', this.token);
            formData.append('source', "website");
            formData.append('meeting_id', this.meeting_id);
            formData.append('voting_options_id', this.voting_option_send);
            this.guardarVotoService.Votesend(formData, this.residential_id, this.token, this.id_user, this.meeting_id, this.show_results, this.keysession, '1');
          }
        }
      }
    }
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
      var data = this.voteData['options'].filter(opt => opt.checked).map(opt => opt.id)
      disableChecks(this.cantidad_votos, this.voteData['options']).then((value) => {
        for (let index3 = 0; index3 < data.length; index3++) {
          document.getElementById(data[index3]).removeAttribute("disabled");
        }
      })
    }
  }

  MetodVoteData(response) {
    this.cantidad_votos = response['request_accepted'];
    this.vote_name = response['name'];
    this.vote_resp = response['options'];
    this.id_vote = response['id'];
  }
}
