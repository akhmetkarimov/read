
import * as types from '../actions/types';
const initialState = {
    authors: [],
    isLoading: false,
};

export default function authorReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_AUTHORS:
        return { ...state, isLoading: true };
    case types.AUTHORS_RECEIVED:
        return { ...state, isLoading: false, authors: action.payload };
    case types.AUTHORS_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
