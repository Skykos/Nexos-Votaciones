
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OnInit, OnDestroy, ViewChild, Input, HostListener, Inject, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { pagesToggleService } from '../../services/toggler.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { ConfigurationRestService } from '../Nexos/service/configuration.rest.service';
import { UserService } from '../Nexos/service/user.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { Globals } from '../Nexos/interface/globals.model';

declare var pg: any;
declare var swal: any;

@Component({
  selector: 'root-layout',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootLayout implements OnInit, OnDestroy {

  nameResidencial: string;


  @ViewChild('root', { read: true, static: false }) root;

  nombre_reunion: string;
  residential_id: any;
  properties: any;
  id: any;
  building_id: string;
  html = '';
  token: string;
  customer_id: string;
  quorum = 0;
  aportes = 0;
  meeting_id: string;
  interval: any;
  quorumAllTime = false;
  quorum_on_real_time: string;
  keysession: string;

  layoutState: string;
  extraLayoutClass: string;
  _boxed: boolean = false
  _menuPin: boolean = false;
  _enableHorizontalContainer: boolean;
  _pageContainerClass = "";
  _contentClass = "";
  _footer: boolean = true;
  _menuDrawerOpen: boolean = false;
  //Mobile
  _secondarySideBar: boolean = false;
  //Mobile
  _mobileSidebar: boolean = true;
  //Mobile
  _mobileHorizontalMenu: boolean = false;
  _pageTitle: string;
  //Sub layout - eg: email
  _layoutOption: string;
  _subscriptions: Array<Subscription> = [];;
  _layout
  @Input()
  public contentClass: string = "";

  @Input()
  public pageWrapperClass: string = "";

  @Input()
  public footer: boolean = true;



  constructor(
    private httpClient: HttpClient,
    private config: ConfigurationRestService,
    public toggler: pagesToggleService,
    public router: Router,
    private userService: UserService, @Inject(SESSION_STORAGE)
    private storage: WebStorageService,
    private global: Globals) {
    const unitsStorage = this.storage.get('units');
    const userStorage = this.storage.get('usuario');
    this.customer_id = userStorage['user_id'];
    const tokenStorage = this.storage.get('token');
    this.token = tokenStorage;
    const residentialStorage = this.storage.get('residential');
    this.meeting_id = residentialStorage['meeting_id'];
    this.quorum_on_real_time = residentialStorage['quorum_real_time']
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
    this.building_id = residentialStorage['residential_id'];
    this.nombre_reunion = residentialStorage['meeting_name'];
    this.keysession = this.storage.get('token2');

    if (this.layoutState) {
      pg.addClass(document.body, this.layoutState);
    }
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        var root = this.router.routerState.snapshot.root;
        while (root) {
          if (root.children && root.children.length) {
            root = root.children[0];
          } else if (root.data) {
            //Custom Route Data here
            this._pageTitle = root.data["title"]
            this._layoutOption = root.data["layoutOption"];
            this._boxed = root.data["boxed"]
            break;
          } else {
            break;
          }
        }
        //Reset Any Extra Layouts added from content pages
        pg.removeClass(document.body, this.extraLayoutClass);
        //Close Sidebar and Horizonta Menu
        if (this._mobileSidebar) {
          this._mobileSidebar = false;
          pg.removeClass(document.body, "sidebar-open");
          this.toggler.toggleMobileSideBar(this._mobileSidebar);
        }
        this._mobileHorizontalMenu = false;
        this.toggler.toggleMobileHorizontalMenu(this._mobileHorizontalMenu);
        //Scoll Top
        this.scrollToTop();
      }

      //Subscribition List
      this._subscriptions.push(this.toggler.pageContainerClass
        .subscribe(state => {
          this._pageContainerClass = state;
        }));

      this._subscriptions.push(this.toggler.contentClass
        .subscribe(state => {
          this._contentClass = state;
        }));

      this._subscriptions.push(this.toggler.bodyLayoutClass
        .subscribe(state => {
          if (state) {
            this.extraLayoutClass = state;
            pg.addClass(document.body, this.extraLayoutClass);
          }
        }));

      this._subscriptions.push(this.toggler.Applayout
        .subscribe(state => {
          this.changeLayout(state);
        }));

      this._subscriptions.push(this.toggler.Footer
        .subscribe(state => {
          this._footer = state;
        }));

      this._subscriptions.push(this.toggler.mobileHorizontaMenu
        .subscribe(state => {
          this._mobileHorizontalMenu = state;
        }));

    });
  }

  /** @function changeLayout
  *   @description Add Document Layout Class
  */
  changeLayout(type: string) {
    this.layoutState = type;
    if (type) {
      pg.addClass(document.body, type);
    }
  }

  /** @function removeLayout
  *   @description Remove Document Layout Class
  */
  removeLayout(type: string) {
    pg.removeClass(document.body, type);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
  }
  ngAfterViewInit() {
  }

  /** @function scrollToTop
  *   @description Force to scroll to top of page. Used on Route
  */
  scrollToTop() {
    let top = window.pageYOffset;
    if (top == 0) {
      let scroller = document.querySelector(".page-container");
      if (scroller) { }
      // scroller.scrollTo(0, 0);
    }
    else {
      // window.scrollTo(0, 0)
    }
  }

  /** @function openQuickView
  *   @description Show Quick View Component / Right Sidebar - Service
  */
  openQuickView($e) {
    $e.preventDefault();
    this.toggler.toggleQuickView();
  }

  /** @function openSearch
  *   @description Show Quick Search Component - Service
  */
  openSearch($e) {
    $e.preventDefault();
    this.toggler.toggleSearch(true);
  }

  /** @function toggleMenuPin
  *   @description Permanently Open / Close Main Sidebar
  */
  toggleMenuPin($e) {
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

  /** @function toggleMenuDrawer
  *   @description Open Main Sidebar Menu Drawer - Service
  */
  toggleMenuDrawer() {
    this._menuDrawerOpen = (this._menuDrawerOpen == true ? false : true);
    this.toggler.toggleMenuDrawer();
  }

  /** @function toggleMobileSidebar
  *   @description Open Main Sidebar on Mobile - Service
  */
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
    //   this._mobileSidebar = false;
    //   pg.removeClass(document.body, "sidebar-open");
    // }
    // else {
    this._mobileSidebar = true;
    pg.addClass(document.body, "sidebar-open");
    // }
    this.toggler.toggleMobileSideBar(this._mobileSidebar);
  }

  /** @function toggleHorizontalMenuMobile
  *   @description Open Secondary Sidebar on Mobile - Service
  */
  toggleSecondarySideBar() {
    this._secondarySideBar = (this._secondarySideBar == true ? false : true);
    this.toggler.toggleSecondarySideBar(this._secondarySideBar);
  }

  /** @function toggleHorizontalMenuMobile
  *   @description Call Horizontal Menu Toggle Service for mobile
  */
  toggleHorizontalMenuMobile() {
    this._mobileHorizontalMenu = (this._mobileHorizontalMenu == true ? false : true);
    this.toggler.toggleMobileHorizontalMenu(this._mobileHorizontalMenu);
  }

  @HostListener("window:resize", [])
  onResize() {
    this.autoHideMenuPin();
  }

  //Utils
  autoHideMenuPin() {
    if (window.innerWidth < 1025) {
      if (pg.hasClass(document.body, "menu-pin")) {
        pg.addClass(document.body, "menu-unpinned");
        pg.removeClass(document.body, "menu-pin");
      }
    }
    else {
      if (pg.hasClass(document.body, "menu-unpinned")) {
        pg.addClass(document.body, "menu-pin");
      }
    }
  }

  goEditUser() {
    this.router.navigate(['/home/editUsers/' + this.id]);

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
}