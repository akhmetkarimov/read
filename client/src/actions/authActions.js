import * as types from './types';

export function signIn(data, history) {
    return { type: types.SIGN_IN, data, history };
}

export function signOut(history) {
    return { type: types.SIGN_OUT, history };
}