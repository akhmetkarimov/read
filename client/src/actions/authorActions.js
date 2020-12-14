import * as types from './types';

export function getAuthors(search) {
    return { type: types.GET_AUTHORS, search };
}