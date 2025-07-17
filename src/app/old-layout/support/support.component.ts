import { Component } from '@angular/core';
import { SUPPORT_EMAIL } from '../../@core/constants/global.constants';

@Component({
  selector: 'app-support',
  standalone: false,
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  supportEmail: string = SUPPORT_EMAIL;
}
