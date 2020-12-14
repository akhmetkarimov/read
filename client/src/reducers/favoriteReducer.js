
import * as types from '../actions/types';
const initialState = {
    favorite: {},
    favoriteResponse: {},
    isLoading: false,
};

export default function favoriteReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_FAVORITES:
        return { ...state, isLoading: true };
    case types.FAVORITES_RECEIVED:
        return { ...state, isLoading: false, favorite: action.payload };
    case types.FAVORITES_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.ADD_FAVORITE:
        return { ...state, isLoading: true };
    case types.ADD_FAVORITE_SUCCESS:
        return { ...state, isLoading: false, favoriteResponse: action.payload };
    case types.ADD_FAVORITE_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
