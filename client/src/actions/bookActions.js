import * as types from './types';

export function getBooks(filter) {
    return { type: types.GET_BOOKS, filter };
}

export function getBookBySlug(slug) {
    return { type: types.GET_BOOK, slug };
}

export function getRecommendedBooks(page) {
    return { type: types.GET_RECOMMENDED_BOOKS, page };
}

export function getBookPdf(file) {
    return { type: types.GET_BOOK_PDF, file };
}