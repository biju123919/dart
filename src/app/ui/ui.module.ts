import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS, HttpClientModule, withInterceptors } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule, MatExpansionPanelHeader} from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { UiComponent } from './ui.component';
// import { SharedModule } from '../shared/shared.module';
import { GenerativeAIModule } from '../generative-ai/generative-ai.module';
import { RouterModule } from '@angular/router';
import { jwtInterceptor } from '../@core/interceptor/jwt.interceptor';
import { errorInterceptor } from '../@core/interceptor/error.interceptor';
import { AppConfigProviders, AppConfigService } from '../@core/service/app.config.service';
import { AuthenticationService } from '../@core/service/authentication.service';
import { UiCoreModule } from '../@core/ui-core.module';
import { UiRoutingModule } from './ui-routing-module';
import { LandingDashboardComponent } from './landing-dashboard/landing-dashboard.component';
import { LayoutModule } from '../@core/@layout/layout.module';
import { OldLayoutModule } from '../old-layout/old-layout.module';
import { ProjectsComponent } from './projects/projects.component';


@NgModule({
  declarations: [
    UiComponent,
    LandingDashboardComponent,
    ProjectsComponent,
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    OldLayoutModule,
    OAuthModule.forRoot(),
    MatDividerModule,
    MatRadioModule,
    MatExpansionModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    MatExpansionPanelHeader,
    MatIconModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTableModule,
    HttpClientModule,
    GenerativeAIModule,
    RouterModule,
    UiCoreModule,
    UiRoutingModule
  ],
  providers: [
    AuthenticationService,
    ...AppConfigProviders,
    provideHttpClient(withInterceptors([jwtInterceptor, errorInterceptor])),
    AppConfigService,
  ],
  bootstrap: [UiComponent],
})
export class UiModule { }
