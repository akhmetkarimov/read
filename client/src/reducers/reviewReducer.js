
import * as types from '../actions/types';
const initialState = {
    reviews: {},
    reviewResponse: ``,
    requestResponse: {},
    universityReviews: [],
    statistics: {},
    isLoading: false,
    faq: [],
};

export default function reviewReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_REVIEWS:
        return { ...state, isLoading: true };
    case types.REVIEWS_RECEIVED:
        return { ...state, isLoading: false, reviews: action.payload };
    case types.REVIEWS_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_STATISTICS:
        return { ...state, isLoading: true };
    case types.STATISTICS_RECEIVED:
        return { ...state, isLoading: false, statistics: action.payload };
    case types.STATISTICS_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_UNI_REVIEWS:
        return { ...state, isLoading: true };
    case types.UNI_REVIEWS_RECEIVED:
        return { ...state, isLoading: false, universityReviews: action.payload };
    case types.UNI_REVIEWS_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_FAQ:
        return { ...state, isLoading: true };
    case types.FAQ_RECEIVED:
        return { ...state, isLoading: false, faq: action.payload };
    case types.FAQ_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.ADD_REVIEW:
        return { ...state, isLoading: true };
    case types.ADD_REVIEW_SUCCESS:
        return { ...state, isLoading: false, reviewResponse: action.payload };
    case types.ADD_REVIEW_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.ADD_REQUEST:
        return { ...state, isLoading: true };
    case types.ADD_REQUEST_SUCCESS:
        return { ...state, isLoading: false, requestResponse: action.payload };
    case types.ADD_REQUEST_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
