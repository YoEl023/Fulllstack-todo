import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { ModalModule } from 'ngx-bootstrap/modal'; 
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideAnimations(),

    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

    importProvidersFrom(ModalModule.forRoot()),
    importProvidersFrom(BsDatepickerModule.forRoot())
  ]
};