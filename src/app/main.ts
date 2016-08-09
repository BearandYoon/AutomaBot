import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from '../environments/environment';
import { AppModule } from './app.module';

if (environment.production) {
  enableProdMode();
}

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
