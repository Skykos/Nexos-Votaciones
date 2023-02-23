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
  residential_id: any;
  name: string;
  texto: string;
  residential: string;
  url_redirection: string;

  constructor(
    private router: Router,
    private config: ConfigurationRestService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private socketService: SocketService,
    private global: Globals
  ) {

    this.residential_id = this.route.snapshot.paramMap.get("id");
    this.httpClient.get(this.config.endpoint5 + 'ApiMeetings/getMeetingDetailsByResidential/' + this.residential_id)
    .subscribe(resp => {
      if (resp['content']['meeting_status'] == '1' || resp['content']['meeting_status'] == '2') {
        this.router.navigate(['login/' + this.residential_id]);
      };
      this.name = resp['content']['meeting_name'];
      this.url_redirection = resp['content']['url_redirection']
      this.texto = resp['content']['meeting_time_start'];
      this.residential = resp['content']['residential_name'];
      this.socketService.listen('meeting_started_' + resp['content']['meeting_id']).subscribe((response) => {
        this.router.navigate(['login/' + this.residential_id]);
      });
      this.carga2()
    })

  }

carga2(){

  this.global.reload_for_recaptcha = true;
    console.log(this.url_redirection)

    if(this.url_redirection==null || this.url_redirection ==''){

    }else{
      // location.href = 'http://asambleas.grupoempresarialnexos.com/votacion/#/login/74'
      location.href = this.url_redirection
    }
}

  ngOnInit() {
    if (this.residential_id == '1613') {
      location.href = 'https://www.alquilersonidoasambleas.com/votacion/#/login/685';
    }
    
  }


}