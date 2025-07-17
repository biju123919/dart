import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayLoaderService } from '../../service/overlay-loader.service';

@Component({
  selector: 'app-overlay-loader',
  standalone: false,
  templateUrl: './overlay-loader.component.html'
})
export class OverlayLoaderComponent {
  loader$: Observable<boolean>;
  constructor(private loaderService: OverlayLoaderService) {
    this.loader$ = this.loaderService.loading$;
  }
}
