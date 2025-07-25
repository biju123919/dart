  import { Component } from '@angular/core';
import { SvgIcon } from 'src/app/@core/enums/svg-icon';
import { SessionStateService } from 'src/app/@core/state-management/session-state.service';
interface NavigationItem {
  key: string;
  label: string;
  route: string;
  urlPatterns?: string[];
  condition?: () => boolean;
}

@Component({
  selector: 'app-landing-dashboard',
  standalone: false,
  templateUrl: './landing-dashboard.component.html'
})
export class LandingDashboardComponent {
  constructor(private sessionStorageService: SessionStateService) { }
    svgIcon = SvgIcon;
  
    private readonly navigationItems: NavigationItem[] = [
      {
        key: 'ai-validation',
        label: 'AI Validation',
        route: '/ai-validation'
      },
      {
        key: 'ecog-agrin',
        label: 'ECOG-ACRIN',
        route: '/ecpg-agrin',
      },
      {
        key: 'alznet',
        label: 'ALZ-NET',
        route: '/alznet',
  
      },
      {
        key: 'nrg',
        label: 'NRG',
        route: '/nrg',
  
      },
      {
        key: 'bdf-index',
        label: 'BDF Index',
        route: '/bdf-index',
  
      },
      {
        key: 'rads',
        label: 'RADS',
        route: '/rads',
      },
      {
        key: 'send',
        label: 'SENO',
        route: '/send',
      },
      {
        key: 'cure13',
        label: 'CURE13',
        route: '/cure13',
      },
      {
        key: 'assess-ai',
        label: 'Assess-AI',
        route: '/assess-ai',
      },
      {
        key: 'legacy-acrin',
        label: 'Legacy-ACRIN',
        route: '/legacy-acrin',
      },
      {
        key: 'ideas',
        label: 'IDEAS',
        route: '/ideas',
      },
      {
        key: 'covid19',
        label: 'COVID-19',
        route: '/covid19',
      },
      {
        key: 'rtog',
        label: 'RTOG',
        route: '/rtog',
      },
      {
        key: 'ti-rads',
        label: 'TI-RADS',
        route: '/ti-rads',
      },
      {
        key: 'qin',
        label: 'QIN',
        route: '/qin',
      },
      {
        key: 'dsi',
        label: 'DSI',
        route: '/dsi',
      },
      {
        key: 'test',
        label: 'TEST',
        route: '/test',
      },
    ];
    get visibleProfileActions(): NavigationItem[] {
      return this.navigationItems.filter(action =>
        !action.condition || action.condition()
      );
    }
  
    isLoggedinUser() {
      return this.sessionStorageService?.isUserLoggedIn
    }
  
  }

