import { Component, ElementRef, inject } from '@angular/core';
import { AuthenticationService } from '../../@core/service/authentication.service';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  private readonly el = inject(ElementRef);
  private readonly authentication = inject(AuthenticationService);

  scrollTo(section: string): void {
    const element = this.el.nativeElement.querySelector(`#${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onLoginClick(): void {
    this.authentication.initializeLoginFlow();
  }
}

