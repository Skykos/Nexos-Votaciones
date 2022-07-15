import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-modalspage',
  templateUrl: './modalspage.component.html',
  styleUrls: ['./modalspage.component.scss']
})
export class ModalspageComponent implements OnInit {
  //Demo code to show types of Modals
  //Please refer docs to how to include modal
  @ViewChild('mdSlideUp',{ read: true, static: false }) mdSlideUp: ModalDirective;
  @ViewChild('smSlideUp',{ read: true, static: false }) smSlideUp: ModalDirective;
  @ViewChild('mdStickUp',{ read: true, static: false }) mdStickUp: ModalDirective;
  @ViewChild('smStickUp',{ read: true, static: false }) smStickUp: ModalDirective;

  slideUp:any = {
    type:"md"
  }
  stickUp:any = {
    type:"md"
  }
  constructor() { }

  ngOnInit() {
  }

  showStickUp(){
    switch(this.stickUp.type) { 
      case "md": { 
        this.mdStickUp.show();
         break; 
      } 
      case "lg": { 
        this.mdStickUp.show();
         break; 
      } 
      case "sm": { 
        this.smStickUp.show();
        break; 
     }
   } 
  }

  showSlideUp(){
    switch(this.slideUp.type) { 
      case "md": { 
        this.mdSlideUp.show();
         break; 
      } 
      case "lg": { 
        this.mdSlideUp.show();
         break; 
      } 
      case "sm": { 
        this.smSlideUp.show();
        break; 
     }
   }     
  }
}
