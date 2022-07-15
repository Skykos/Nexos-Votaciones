import { Routes } from '@angular/router';
import { CondensedComponent } from './@pages/layouts';
import { DashboardComponent } from './@pages/layouts/Nexos/Componentes/dashboard/dashboard.component';
import { LoginComponent } from './@pages/layouts/Nexos/Componentes/login/login.component';
import { Quorum2Component } from './@pages/layouts/Nexos/Componentes/quorum2/quorum2.component';
import { Documentos2Component } from './@pages/layouts/Nexos/Componentes/documentos2/documentos2.component';
import { Votacion2Component } from './@pages/layouts/Nexos/Componentes/votacion2/votacion2.component';
import { Votaciones2Component } from './@pages/layouts/Nexos/Componentes/votaciones2/votaciones2.component';
import { Resultados2Component } from './@pages/layouts/Nexos/Componentes/resultados2/resultados2.component';
import { ChatComponent } from './@pages/layouts/Nexos/Componentes/chat/chat.component';
import { PrevioComponent } from './@pages/layouts/Nexos/Componentes/previo/previo.component';
import { IndexComponent } from './@pages/layouts/Nexos/Componentes/index/index.component';
import { FinalizoComponent } from './@pages/layouts/Nexos/Componentes/finalizo/finalizo.component';
import { UserHelpComponent } from './@pages/layouts/Nexos/Componentes/user-help/user-help.component';
import { MenuParticipantsComponent } from './@pages/layouts/Nexos/Componentes/menu-participants/menu-participants.component';
import { RequestCredentialsComponent } from './@pages/layouts/Nexos/Componentes/request-credentials/request-credentials.component';

export const AppRoutes: Routes = [

  {path: '', data: { breadcrumb: '' }, component: IndexComponent},
  { path: 'login/:id', data: { breadcrumb: 'login/:id' }, component: LoginComponent },
  { path: 'previo/:id', data: { breadcrumb: 'previo/:id' }, component: PrevioComponent },
  { path: 'finalizado/:id', data: { breadcrumb: 'finalizado/:id' }, component: FinalizoComponent },
  { path: 'SolicitudDeCredenciales/:residential_id/:meeting_id', data: { breadcrumb: 'SolicitudDeCredenciales/:residential_id/:meeting_id' }, component: RequestCredentialsComponent },
  {
    path: 'home', component: CondensedComponent, children: [
      {
        path: '', component: DashboardComponent, children: [
          { path: 'quorum2', component: Quorum2Component},
          // { path: 'quorum2', component: Quorum2Component, outlet: 'child' },
          { path: 'votacion2', component: Votacion2Component },
          { path: 'votacion', component: Votacion2Component, outlet: 'second' },
          { path: 'documentos2', component: Documentos2Component },
          { path: 'votaciones2', component: Votaciones2Component },
          { path: 'resultados2/:id', component: Resultados2Component },
          { path: 'chat', component: ChatComponent },
          { path: 'ayuda', component: UserHelpComponent },
          { path: 'participantes', component: MenuParticipantsComponent},
        ]
      },
    ]
  },
];
