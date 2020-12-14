
import * as types from '../actions/types';
const initialState = {
    categories: [],
    searchCategories: [],
    isLoading: false,
};

export default function categoryReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_CATEGORIES:
        return { ...state, isLoading: true };
    case types.CATEGORIES_RECEIVED:
        return { ...state, isLoading: false, categories: action.payload };
    case types.CATEGORIES_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_CATEGORIES_SEARCH:
        return { ...state, isLoading: true };
    case types.SEARCH_CATEGORIES_RECEIVED:
        return { ...state, isLoading: false, searchCategories: action.payload };
    case types.SEARCH_CATEGORIES_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
