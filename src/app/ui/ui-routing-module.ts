import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../generative-ai/components/dashboard/dashboard.component';
import { UseCaseComponent } from '../generative-ai/components/use-case/use-case.component';
import { UserInfoResolver } from '../@core/resolvers/user-info.resolver';
import { authGuard } from '../@core/guard/auth.guard';
import { OktaAccessComponent } from '../@core/Components/okta-access/okta-access.component';
import { WelcomeComponent } from '../old-layout/welcome/welcome.component';
import { ReportsComponent } from './reports/reports.component';
import { oktaSsoGuard } from '../@core/guard/okta-sso.guard';
import { LandingDashboardComponent } from './landing-dashboard/landing-dashboard.component';
import {ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  { path: '', component: LandingDashboardComponent,
    data:{title : 'Data analysis & research toolkit' }
   },
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: { user: UserInfoResolver },
    canActivate: [oktaSsoGuard],
    data:{title : 'Generative AI ' }
  },
  {
    path: 'home',
    component: LandingDashboardComponent,
    resolve: { userSync: UserInfoResolver },
    canActivate: [oktaSsoGuard],
    data:{title : 'Data analysis & research toolkit ' }
  },
  { path: 'usecase/:project/:useCase', component: UseCaseComponent },
  { path: 'reports', component: ReportsComponent,   data:{title : 'Reports' } },
  { path: 'projects', component: ProjectsComponent,   data:{title : 'Data analysis & research toolkit' } },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class UiRoutingModule { }