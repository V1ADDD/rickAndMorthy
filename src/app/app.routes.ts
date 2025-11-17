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
    }
];
