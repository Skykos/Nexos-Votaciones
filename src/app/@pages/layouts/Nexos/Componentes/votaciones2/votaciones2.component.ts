import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { Globals } from '../../interface/globals.model';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-votaciones2',
  templateUrl: './votaciones2.component.html',
  styleUrls: ['./votaciones2.component.scss']
})
export class Votaciones2Component implements OnInit {

  id_vote = 0;
  votes: [] = [];
  meeting_id: string;
  id_user: string;
  residential_id: any;
  moroso: string;
  observer: string;

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private global: Globals,
    private router: Router,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
  ) {
    if (global.time == 1) {
      location.reload();
    }
    const userStorage = this.storage.get('usuario');
    const residentialStorage = this.storage.get('residential');
    if (this.storage.get('usuario') == null || this.storage.get('usuario') == undefined || this.storage.get('usuario') == '' ||
    this.storage.get('token') == null || this.storage.get('token') == undefined || this.storage.get('token') == '' ||
    this.storage.get('residential') == null || this.storage.get('residential') == undefined || this.storage.get('residential') == '' || 
    this.storage.get('token2') == null || this.storage.get('token2') == undefined || this.storage.get('token2') == ''||
    this.storage.get('speaker') == null || this.storage.get('speaker') == undefined ||
    this.storage.get('observer') == null || this.storage.get('observer') == undefined ||
    this.storage.get('moroso') == null || this.storage.get('moroso') == undefined) {
       sessionStorage.clear();
      this.router.navigate(['login/' + this.residential_id]);
    }
    this.meeting_id = residentialStorage['meeting_id']
    this.id_user = userStorage['user_id'];
    this.residential_id = residentialStorage['residential_id'];
    this.moroso = this.storage.get('moroso');
    this.observer = this.storage.get('observer')
    this.httpClient.get(this.config.endpoint + 'UtilServices/getVotesByMeeting?key=' + this.config.key + '&meeting_id=' + this.meeting_id + '&user_id=' + this.id_user)
      .subscribe(resp => {
        this.votes = resp['content'];
      });
  }

  ngOnInit() {
  }

  goVote(id_vote, status_id) {
    // if (status_id == '1' && this.observer == "0" && this.moroso == "0") {
    //   this.router.navigate(['home/votacion2'])
    // } else {
      this.router.navigate(['home/resultados2/' + id_vote])
    // }
  }

}