import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Подключаем HTTP клиент
    ...appConfig.providers // Сохраняем другие настройки
  ],
})
  .catch((err) => console.error(err));
