import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { SocketService } from '../../service/socket.service';


@Component({
  selector: 'app-menu-participants',
  templateUrl: './menu-participants.component.html',
  styleUrls: ['./menu-participants.component.scss']
})
export class MenuParticipantsComponent implements OnInit {
  residential_id: string;
  keysession: string;
  meeting_id: string;
  unitsList: any

  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    private router: Router,
    private socketService: SocketService,
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
  ) {
    const unitsStorage = this.storage.get('units');
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
    this.keysession = this.storage.get('token2');
    this.meeting_id = residentialStorage['meeting_id'];
    $('#0').removeClass("active");
    $('#1').removeClass("active");
    $('#2').addClass("active");
    $('#3').removeClass("active");
    $('#4').removeClass("active");
    $('#5').removeClass("active");
    $('#6').removeClass("active");
  }

  ngOnInit() {
    this.socketService.listen('meeting_quorum_' + this.meeting_id).subscribe((response) => {
      this.updateParticipants()
    });
    this.updateParticipants()
    this.socketService.listen('hand_raised_' + this.meeting_id).subscribe((response) => {
      this.updateParticipants()
    });
  }

  ngOnDestroy() {
    this.socketService.removeListen('meeting_quorum_' + this.meeting_id);
    this.socketService.removeListen('hand_raised_' + this.meeting_id);
  }

  updateParticipants() {
    this.httpClient.get(this.config.endpoint4 + 'ApiRaisingHands/getCurrentRaisingHandRecordsByMeeting/' + this.keysession + '/' + this.meeting_id).subscribe((response) => {
      this.unitsList = response['content'];
    });
  }

}