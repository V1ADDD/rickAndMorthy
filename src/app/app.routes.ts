import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth-guard';
import { LoginGuard } from './shared/guards/login-guard';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "login"
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login').then((comp)=>comp.Login),
        canActivate: [LoginGuard]
    },
    {
        path: "characters",
        loadComponent: () => import('./features/characters-list/characters-list').then((comp) => comp.CharactersList),
        canActivate: [AuthGuard]
    },
    {
        path: "locations",
        loadComponent: () => import('./features/locations-list/locations-list').then((comp) => comp.LocationsList),
        canActivate: [AuthGuard]
    },
    {
        path: "episodes",
        loadComponent: () => import('./features/episodes-list/episodes-list').then((comp) => comp.EpisodesList),
        canActivate: [AuthGuard]
    },
    {
        path: "favorites",
        loadComponent: () => import('./features/favorites-list/favorites-list').then((comp) => comp.FavoritesList),
        canActivate: [AuthGuard]
    }
];
