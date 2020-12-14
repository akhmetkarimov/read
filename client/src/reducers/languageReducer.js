
import * as types from '../actions/types';
const initialState = {
    languages: [],
    isLoading: false,
};

export default function languageReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_LANGUAGES:
        return { ...state, isLoading: true };
    case types.LANGUAGES_RECEIVED:
        return { ...state, isLoading: false, languages: action.payload };
    case types.LANGUAGES_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
