import { Component, Inject, OnInit } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import { Router } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Component({
  selector: 'app-user-help',
  templateUrl: './user-help.component.html',
  styleUrls: ['./user-help.component.scss']
})
export class UserHelpComponent implements OnInit {
residential_id:any;
  constructor(
    @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private router: Router,
  ) {
    
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
    $('#0').removeClass("active");
    $('#1').removeClass("active");
    $('#2').removeClass("active");
    $('#3').removeClass("active");
    $('#4').removeClass("active");
    $('#5').removeClass("active");
    $('#6').addClass("active");
  }

  ngOnInit() {

  }

}
