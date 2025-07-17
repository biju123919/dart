import { environment } from '../../../environments/environment';
import { APP_INITIALIZER, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AppConfigService {
  private configUrl = `assets/config/config.${environment.name}.json`;
  public environment: any;

  constructor(
    private http: HttpClient) { }

  async loadConfiguration() {
    let url = this.configUrl;
    return this.getConfigs(url).then((configData: any) => {
      this.environment = configData;
    });
  }

  private getConfigs(configUrl: string) {
    const fileService = this.http.get(configUrl);
    return lastValueFrom(fileService);
  }

}


export const AppConfigProviders = [
  {
    provide: APP_INITIALIZER,
    useFactory: initAppConfig,
    deps: [AppConfigService],
    multi: true
  },
];

export function initAppConfig(appConfig: AppConfigService) {
  return async () => await appConfig.loadConfiguration();
}