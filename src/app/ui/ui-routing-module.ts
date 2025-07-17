import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../generative-ai/components/dashboard/dashboard.component';
import { UseCaseComponent } from '../generative-ai/components/use-case/use-case.component';
import { UserInfoResolver } from '../@core/resolvers/user-info.resolver';
import { authGuard } from '../@core/guard/auth.guard';
import { OktaAccessComponent } from '../@core/Components/okta-access/okta-access.component';
import { WelcomeComponent } from '../old-layout/welcome/welcome.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: { user: UserInfoResolver },
    canActivate: [authGuard],
  },
  { path: 'home', component: OktaAccessComponent },
  { path: 'usecase/:project/:useCase', component: UseCaseComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class UiRoutingModule { }