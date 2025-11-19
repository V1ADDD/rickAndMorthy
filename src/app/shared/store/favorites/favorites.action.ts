import { createAction, props } from "@ngrx/store";
import { Character } from "../../models/character";
import { ResponseError } from "../../models/error";

export const loadFavorites = createAction(
    '[Favorites] Load Favorites',
    props<{ ids: number[] }>()
);

export const loadFavoritesSuccess = createAction(
    '[Favorites] Load Favorites Success',
    props<{ favorites: Character[] }>()
)

export const loadFavoritesFailure = createAction(
    '[Favorites] Load Favorites Failure',
    props<{ error: ResponseError }>()
)

export const toggleFavorite = createAction(
    '[Favorites] Toggle Favorite',
    props<{ toggleId: number}>()
)