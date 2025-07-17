import { platformBrowser } from '@angular/platform-browser';
import { UiModule } from './app/ui/ui.module';

platformBrowser().bootstrapModule(UiModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
