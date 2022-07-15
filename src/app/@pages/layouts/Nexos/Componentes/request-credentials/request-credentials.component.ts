import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Globals } from '../../interface/globals.model';
import { ConfigurationRestService } from '../../service/configuration.rest.service';
declare var swal: any;

@Component({
  selector: 'app-request-credentials',
  templateUrl: './request-credentials.component.html',
  styleUrls: ['./request-credentials.component.scss']
})
export class RequestCredentialsComponent implements OnInit {
  mailToConfirm = '';
  meeting_id = '';
  residential_id = '';
  showButton = true;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private config: ConfigurationRestService,
    private route: ActivatedRoute,
    private global: Globals
  ) {
    this.residential_id = this.route.snapshot.paramMap.get("residential_id");
    this.meeting_id = this.route.snapshot.paramMap.get("meeting_id");
    this.global.messageLogin = false;
  }

  ngOnInit() {
  }

  getUserByEmail() {
    this.showButton = false;
    swal.fire(
      {
        html: '<h4>Cargando...</h4><br><img src="./assets/img/giphy.gif" style="width: 120px">',
        showCancelButton: false,
        showConfirmButton: false,
        showCloseButton: true
      }
    );
    if (this.mailToConfirm == '') {
      swal.fire('Mensaje', 'Debe escribir un correo', 'info')
      this.showButton = true;
    } else {
      this.global.messageLogin = false;
      this.httpClient.get(this.config.endpoint4 + 'ApiUsers/requestSignInPassword/' + this.mailToConfirm + '/' + this.meeting_id)
        .subscribe(resp => {
          if (resp['success']) {
            swal.fire(
              {
                icon: "success",
                text: resp['message'],
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: true,
                timer: 20000
              }
            );
            this.showButton = true;
          } else {
            swal.fire(
              {
                icon: "info",
                text: resp['message'],
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: true,
                timer: 20000
              }
            );
            this.showButton = true;
          }
          this.router.navigate(['login/' + this.residential_id])
        });
    }
  }

  goBack() {
    this.router.navigate(['login/' + this.residential_id])
  }

}