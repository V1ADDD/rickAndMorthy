import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { charactersReducer } from './shared/store/character/character.reducer';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { CharacterEffects } from './shared/store/effects/character.effect';
import { locationsReducer } from './shared/store/location/location.reducer';
import { LocationEffects } from './shared/store/effects/location.effect';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { episodesReducer } from './shared/store/episode/episode.reducer';
import { EpisodeEffects } from './shared/store/effects/episode.effect';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { userReducer } from './shared/store/user/user.reducer';
import { UserEffects } from './shared/store/effects/user.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore({
      characters: charactersReducer,
      locations: locationsReducer,
      episodes: episodesReducer,
      user: userReducer,
    }),
    provideEffects([CharacterEffects, LocationEffects, EpisodeEffects, UserEffects]),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
