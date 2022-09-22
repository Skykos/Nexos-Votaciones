import { Component, OnInit, Inject } from '@angular/core';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../interface/globals.model';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { SocketService } from '../../service/socket.service';
declare var swal: any;

@Component({
  selector: 'app-quorum2',
  templateUrl: './quorum2.component.html',
  styleUrls: ['./quorum2.component.scss']
})
export class Quorum2Component implements OnInit {

  quorum: any;
  quorumShow = 0;
  residential_id: any;
  code: string;
  asistentes: any;
  aportes: any;
  meeting_id: string;
  unidades: any;
  valueContainer: any;
  progress: any;
  keysession: string;
  user_id: string;
  show_confirm_button = false;


  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private global: Globals,
    private router: Router,
    private socketService: SocketService,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,) {
    const unitsStorage = this.storage.get('units');
    const userStorage = this.storage.get('usuario');
    const tokenStorage = this.storage.get('token');
    this.keysession = this.storage.get('token2');
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
    this.meeting_id = residentialStorage['meeting_id']
    this.residential_id = residentialStorage['residential_id'];
    this.code = residentialStorage['uuid_code'];
    this.user_id = userStorage['user_id'];


    $('#0').removeClass("active");
    $('#1').addClass("active");
    $('#2').removeClass("active");
    $('#3').removeClass("active");
    $('#4').removeClass("active");
    $('#5').removeClass("active");
    $('#6').removeClass("active");
  }


  ngOnInit() {

    this.httpClient.get(this.config.endpoint4 + 'ApiVoting/getChartsByMeeting/' + this.keysession + '/' + this.meeting_id)
      .subscribe(resp2 => {
        if (resp2['message'] == "La sesión es inválida") {
          this.httpClient.get(this.config.endpoint4 + '/ApiUsers/checkIfPresenceConfirmed/' + this.keysession + '/' + this.meeting_id)
            .subscribe(resp => {
              if (resp['success']) {
                this.show_confirm_button = true;
              }
              else {
                swal.fire('Atención', 'Su sesión no es valida por favor ingrese de nuevo.', 'info');
              }
            })
        }
        else {
          if (resp2 == null) {
            this.quorum = 0;
            this.asistentes = 0;
          }
          else {
            this.quorum = resp2['coefficient'];
            this.quorumShow = 0;
            this.asistentes = resp2['attendance'];
            this.aportes = resp2['aportes'];
            this.unidades = resp2['total_properties'];
            if (this.quorumShow != this.quorum) {
              this.quorumAnimated(this.quorum)
            }
          }
        }
      });
    this.socketService.listen('meeting_quorum_' + this.meeting_id).subscribe((response) => {
      clearInterval(this.progress)
      this.quorum = response['coefficient'];
      this.asistentes = response['attendance'];
      this.aportes = response['aportes'];
      this.unidades = response['total_properties'];
      // if (this.quorumShow != this.quorum) {
      this.quorumAnimatedSocket(this.quorum)
      // }
    });
  }

  logOut() {
    swal.fire({
      title: 'Su sesión es invalida, por favor inicie sesión de nuevo',
      showCancelButton: false,
      showConfirmButton: false,
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

  ngOnDestroy() {
    clearInterval(this.progress);
    this.socketService.removeListen('meeting_quorum_' + this.meeting_id);
  }

  goRoute() {
    this.router.navigate(['home/'])
  }

  CheckPresence() {
    this.show_confirm_button = false;
    this.httpClient.get(this.config.endpoint4 + 'ApiUsers/confirmPresence/' + this.keysession + '/' + this.meeting_id)
      .subscribe(resp5 => {
      });
  }

  quorumAnimated(coefficient) {
    var progressBar = document.getElementById("circularprogress")!;
    this.valueContainer = document.querySelector(".value-container");
    var progressValue = this.quorumShow;
    if (coefficient < 100) {
      var progressEndValue = coefficient.toString().slice(0, 5);
    } else {
      var progressEndValue = coefficient;
    }
    progressEndValue = parseFloat(progressEndValue);
    var speed = 30;
    if (progressBar) {
      this.progress = setInterval(() => {
        progressValue++;
        progressBar.style.background = `conic-gradient(
        #e56e22 ${progressValue * 3.6}deg,
        #EEEEEE ${progressValue * 3.6}deg
      )`;
        if (progressValue > progressEndValue) {
          clearInterval(this.progress);
          this.valueContainer.textContent = `${progressEndValue}%`;
        } else {
          this.valueContainer.textContent = `${progressValue}%`;
        }
        if (progressValue > 100) {
          progressValue = 100;
          clearInterval(this.progress);
        }
      }, speed);
    }
    this.quorumShow = coefficient;
  }

  quorumAnimatedSocket(coefficient) {
    var progressBar = document.getElementById("circularprogress")!;
    this.valueContainer = document.querySelector(".value-container");
    var progressValue = this.quorumShow;
    if (coefficient < 100) {
      var progressEndValue = coefficient.toString().slice(0, 5);
    } else {
      var progressEndValue = coefficient;
    }
    progressEndValue = parseFloat(progressEndValue);
    var speed = 30;
    if (progressBar) {
      if (progressValue > progressEndValue) {
        this.progress = setInterval(() => {
          progressValue--;
          progressBar.style.background = `conic-gradient(
          #e56e22 ${progressValue * 3.6}deg,
          #EEEEEE ${progressValue * 3.6}deg
        )`;
          if (progressValue < progressEndValue) {
            clearInterval(this.progress);
            this.valueContainer.textContent = `${progressEndValue}%`;
          } else {
            this.valueContainer.textContent = `${progressValue}%`;
          }
          if (progressValue < 0) {
            progressValue = 0;
            clearInterval(this.progress);
          }
        }, speed);
      } else {
        this.progress = setInterval(() => {
          progressValue++;
          progressBar.style.background = `conic-gradient(
          #e56e22 ${progressValue * 3.6}deg,
          #EEEEEE ${progressValue * 3.6}deg
        )`;
          if (progressValue > progressEndValue) {
            clearInterval(this.progress);
            this.valueContainer.textContent = `${progressEndValue}%`;
          } else {
            this.valueContainer.textContent = `${progressValue}%`;
          }
          if (progressValue > 100) {
            progressValue = 100;
            clearInterval(this.progress);
          }
        }, speed);
      }
    }
    this.quorumShow = coefficient;
  }

}