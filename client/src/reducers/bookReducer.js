
import * as types from '../actions/types';
const initialState = {
    book: {},
    bookItem: {},
    pdf: {},
    isLoading: false,
};

export default function bookReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_BOOKS:
        return { ...state, isLoading: true };
    case types.BOOKS_RECEIVED:
        return { ...state, isLoading: false, book: action.payload };
    case types.BOOKS_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_RECOMMENDED_BOOKS:
        return { ...state, isLoading: true };
    case types.RECOMMENDED_BOOKS_RECEIVED:
        return { ...state, isLoading: false, book: action.payload };
    case types.RECOMMENDED_BOOKS_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_BOOK_PDF:
        return { ...state, isLoading: true };
    case types.BOOK_PDF_RECEIVED:
        return { ...state, isLoading: false, pdf: action.payload };
    case types.BOOK_PDF_FAILED:
        return { ...state, isLoading: false, error: action.error };
    case types.GET_BOOK:
        return { ...state, isLoading: true };
    case types.BOOK_RECEIVED:
        return { ...state, isLoading: false, bookItem: action.payload };
    case types.BOOK_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
