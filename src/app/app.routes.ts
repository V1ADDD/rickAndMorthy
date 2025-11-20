import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard';
import { loginGuard } from './shared/guards/login-guard';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "login"
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then((comp)=>comp.Login),
        canMatch: [loginGuard]
    },
    {
        path: "characters",
        loadComponent: () => import('./features/characters-list/characters-list').then((comp) => comp.CharactersList),
        canMatch: [authGuard]
    },
    {
        path: "locations",
        loadComponent: () => import('./features/locations-list/locations-list').then((comp) => comp.LocationsList),
        canMatch: [authGuard]
    },
    {
        path: "episodes",
        loadComponent: () => import('./features/episodes-list/episodes-list').then((comp) => comp.EpisodesList),
        canMatch: [authGuard]
    },
    {
        path: "favorites",
        loadComponent: () => import('./features/favorites-list/favorites-list').then((comp) => comp.FavoritesList),
        canMatch: [authGuard]
    }
];
