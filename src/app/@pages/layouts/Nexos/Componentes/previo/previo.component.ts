import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../../service/socket.service';
import { Globals } from '../../interface/globals.model';

@Component({
  selector: 'app-previo',
  templateUrl: './previo.component.html',
  styleUrls: ['./previo.component.scss']
})
export class PrevioComponent implements OnInit {
  id_building: any;
  name: string;
  texto: string;
  residential: string;

  constructor(
    private router: Router,
    private config: ConfigurationRestService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private socketService: SocketService,
    private global: Globals
  ) {
    this.id_building = this.route.snapshot.paramMap.get("id");
    this.httpClient.get(this.config.endpoint4 + 'ApiMeetings/getMeetingDetailsByResidential/' + this.id_building)
      .subscribe(resp => {
        if (resp['content']['meeting_status'] == '1' || resp['content']['meeting_status'] == '2') {
          this.router.navigate(['login/' + this.id_building]);
        };
        this.name = resp['content']['meeting_name'];
        this.texto = resp['content']['meeting_time_start'];
        this.residential = resp['content']['residential_name'];
        this.socketService.listen('meeting_started_' + resp['content']['meeting_id']).subscribe((response) => {
          this.router.navigate(['login/' + this.id_building]);
        });
      });
  }

  ngOnInit() {
    this.global.reload_for_recaptcha = true;
    if (this.id_building == '1613') {
      location.href = 'https://www.alquilersonidoasambleas.com/votacion/#/login/685';
    }
  }

}