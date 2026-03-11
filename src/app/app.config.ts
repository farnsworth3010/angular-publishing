import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment.development';
import { Configuration } from './api';
import { routes } from './app.routes';
import { appInitializer } from './core/appInit';
import { MyPreset } from './theme';

registerLocaleData( en );

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter( routes ),
    provideHttpClient(), provideAnimationsAsync(), provideHttpClient(),
    MessageService,
    {
      provide: Configuration,
      useFactory: () => {
        return new Configuration( {
          basePath: environment.baseApiUrl,
          credentials: {
            bearer: () => localStorage.getItem( 'token' ) ?? ''
          }
        } );
      }
    },
    provideAppInitializer( appInitializer ),
    DialogService,
    providePrimeNG( {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: false || 'none',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    } )
  ]
};
