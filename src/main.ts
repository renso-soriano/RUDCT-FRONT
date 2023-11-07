import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  window.console.log = () => { } //Desactivando console.log() en produccion ;)
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
