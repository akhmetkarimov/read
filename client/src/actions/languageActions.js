import * as types from './types';

export function getLanguages(search) {
    return { type: types.GET_LANGUAGES, search };
}