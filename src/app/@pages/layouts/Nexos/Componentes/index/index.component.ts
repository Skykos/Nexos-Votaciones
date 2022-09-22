import { Component, OnInit } from '@angular/core';
import { Globals } from '../../interface/globals.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(
    private global: Globals
  ) {
    this.global.reload_for_recaptcha = true;
  }

  ngOnInit() {
  }

}
