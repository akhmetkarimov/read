import * as types from './types';

export function getCategories() {
    return { type: types.GET_CATEGORIES };
}

export function getSearchCategories(search) {
    return { type: types.GET_CATEGORIES_SEARCH, search };
}
