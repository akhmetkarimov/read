import * as types from './types';

export function getFavorites(page) {
    return { type: types.GET_FAVORITES, page };
}

export function addFavorite(fav) {
    return { type: types.ADD_FAVORITE, fav };
}
