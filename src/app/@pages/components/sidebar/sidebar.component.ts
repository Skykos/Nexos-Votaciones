import { Component, OnInit, ElementRef, ViewEncapsulation, Inject, forwardRef, Input, ViewChild, TemplateRef, ContentChild, HostListener, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { pagesToggleService } from '../../services/toggler.service';
import { CondensedComponent } from '../../layouts/condensed/condensed.component'
import { Router } from '@angular/router';
import { UserService } from '../../layouts/Nexos/service/user.service';
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from '../../layouts/Nexos/service/configuration.rest.service';
import swal from 'sweetalert2';


declare var pg: any;


@Component({
  selector: 'pg-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    'class': 'page-sidebar',
  },
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

  subscriptions: Array<Subscription> = [];
  pin: boolean = false;
  drawer: boolean = false;
  sidebar;
  timer;
  _menuPin: boolean = true;
  _menuDrawerOpen: boolean = false;
  id_perfil: any;
  uuid: any;
  userStorage: any;
  building_id: any;
  customer_id: string;
  quorum_on_real_time: string;
  _mobileSidebar: boolean = false;
  cancelText = "Cancelar";
  cancelButtonColor = "#262626";
  keysession: string;
  meeting_id: string;
  user_id: string;
  residential_id: string;
  is_speaker: number = 0;





  toggleMenuDrawer() {
    this._menuDrawerOpen = (this._menuDrawerOpen == true ? false : true);
    this.toggler.toggleMenuDrawer();
  }

  toggleMenuPin2($event) {
    if (pg.isVisibleSm()) {
      this._menuPin = false;
      return;
    }
    if (this._menuPin) {
      pg.removeClass(document.body, "menu-pin");
      this._menuPin = false;
    } else {
      pg.addClass(document.body, "menu-pin");
      this._menuPin = true;
    }
  }

  @HostBinding('style.transform')
  style: string;
  token: string;

  private sideBarWidth = 280;
  private sideBarWidthCondensed = 280 - 50;


  @ContentChild('sideBarOverlay', { read: true, static: false }) sideBarOverlay: TemplateRef<void>;
  @ContentChild('sideBarHeader', { read: true, static: false }) sideBarHeader: TemplateRef<void>;
  @ContentChild('menuItems', { read: true, static: false }) menuItems: TemplateRef<void>;

  constructor(
    private router: Router,
    private appSidebar: ElementRef,
    private toggler: pagesToggleService,
    CondesendComponent: CondensedComponent,
    private userService: UserService, @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
  ) {
    this.userStorage = this.storage.get('user');
    const residentialStorage = this.storage.get('residential');
    this.building_id = residentialStorage['residential_id'];
    const tokenStorage = this.storage.get('token');
    this.token = tokenStorage;
    const userStorage = this.storage.get('usuario');
    this.customer_id = userStorage['user_id'];

    this.quorum_on_real_time = residentialStorage['quorum_real_time'];

    this.subscriptions.push(this.toggler.sideBarToggle.subscribe(toggle => { this.toggleMobile(toggle) }));
    this.subscriptions.push(this.toggler.pageContainerHover.subscribe(message => { this.closeSideBar() }));
    this.subscriptions.push(this.toggler.menuDrawer.subscribe(message => { this.toggleDrawer() }));
    this.mobileSidebar = false;
    this.keysession = this.storage.get('token2');
    this.meeting_id = residentialStorage['meeting_id'];
    this.user_id = this.storage.get('usuario')['user_id'];
    this.residential_id = this.storage.get('residential')['residential_id'];
    this.is_speaker = this.storage.get('speaker');



  }

  ngOnInit() {
  }

  toggleMobileSidebar() {


    if (pg.isVisibleSm()) {
      this._menuPin = false;
      return;
    }
    if (this._menuPin) {
      pg.removeClass(document.body, "menu-pin");
      // this._menuPin = false;
    } else {
      pg.addClass(document.body, "menu-pin");
      // this._menuPin = true;
    }

    // if (this._mobileSidebar) {
    // this._mobileSidebar = false;
    pg.removeClass(document.body, "sidebar-open");
    // }
    // else {
    //   // this._mobileSidebar = true;
    //   pg.addClass(document.body, "sidebar-open");
    // }
    this.toggler.toggleMobileSideBar(this._mobileSidebar);
  }

  ngOnDestroy() {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
    clearTimeout(this.timer);
  }
  @HostBinding('class.visible') mobileSidebar: boolean;

  @HostListener('mouseenter', ["$event"])
  @HostListener('click', ["$event"])
  openSideBar() {
    if (pg.isVisibleSm() || pg.isVisibleXs()) return false
    if (this.pin) return false;

    // this.style = 'translate3d(' + this.sideBarWidthCondensed + 'px, 0,0)'
    // pg.addClass(document.body, "sidebar-visible");
  }

  closeSideBar() {
    if (pg.isVisibleSm() || pg.isVisibleXs()) return false
    if (this.pin) return false;

    this.style = 'translate3d(0,0,0)'
    pg.removeClass(document.body, "sidebar-visible");

    //this.drawer = false;
  }

  //Nexos sidebar
  toggleMenuPin() {
    if (this.pin)
      this.pin = false;

    else
      this.pin = true;
  }

  toggleDrawer() {
    if (this.drawer)
      this.drawer = false;
    else
      this.drawer = true;
  }

  toggleMobile(toggle: boolean) {
    clearTimeout(this.timer);
    if (toggle) {
      this.mobileSidebar = toggle;
    }
    else {
      this.timer = setTimeout(() => {
        this.mobileSidebar = toggle;
      }, 400)
    }
  }

  logOut() {
    swal.fire({
      title: '¿Está seguro de que desea cerrar sesión?”',
      showCancelButton: true,
      confirmButtonColor: '#e56e22',
      cancelButtonColor: '#999',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
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

  buttonHide() {
    if (document.getElementById("icon-sidebar").style.display == "none") {
      document.getElementById("icon-sidebar").style.display = "inline-block";
      (document.getElementById("icon-button-menu") as HTMLButtonElement).removeAttribute("disabled");
    } else {
      document.getElementById("icon-sidebar").style.display = "none";
      (document.getElementById("icon-button-menu") as HTMLButtonElement).setAttribute("disabled", "true");
    }
  }

  scrollBottom() {
    setTimeout(() => {
      window.scroll(0, 500)
    }, 800);
  }

  navigate(url) {
    if (this.router.url != url) {
      this.buttonHide();
      this.scrollBottom();
      this.router.navigate([url]);
      if (document.getElementById('votacionReload') && url == 'home/votacion2') {
        document.getElementById('votacionReload').click();
      }
    }
  }
}