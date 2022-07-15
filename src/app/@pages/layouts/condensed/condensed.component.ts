import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit,Input,ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';
import { Router, ActivatedRoute } from '@angular/router';
import { root } from 'rxjs/internal/util/root';

@Component({
  selector: 'condensed-layout',
  templateUrl: './condensed.component.html',
  styleUrls: ['./condensed.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CondensedComponent extends RootLayout implements OnInit {
  name: string;

    ngOnInit() {
      //this.name = this.nombre_usuario;
    }
}
