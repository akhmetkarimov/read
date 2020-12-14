import * as types from './types';

export function getUser() {
    return { type: types.GET_USER };
}

export function changePassword(password) {
    return { type: types.CHANGE_PASSWORD, password };
}