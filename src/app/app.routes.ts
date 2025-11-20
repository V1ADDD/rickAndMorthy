import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "characters"
    },
    {
        path: "characters",
        loadComponent: () => import('./features/characters-list/characters-list').then((comp) => comp.CharactersList)
    },
    {
        path: "locations",
        loadComponent: () => import('./features/locations-list/locations-list').then((comp) => comp.LocationsList)
    },
    {
        path: "episodes",
        loadComponent: () => import('./features/episodes-list/episodes-list').then((comp) => comp.EpisodesList)
    },
    {
        path: "favorites",
        loadComponent: () => import('./features/favorites-list/favorites-list').then((comp) => comp.FavoritesList)
    }
];
