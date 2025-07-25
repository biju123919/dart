import { Component } from '@angular/core';
import { CURRENT_YEAR } from '../../@core/constants/global.constants';

@Component({
  selector: 'app-old-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly currentYear = CURRENT_YEAR;
}
