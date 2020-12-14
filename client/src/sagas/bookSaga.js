import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";

export function* getBooks(action) {
    let { page, search, language, categories, authors, isbn } = action.filter;
    if (!page) {
        page = 1;
    }
    if (!search) {
        search = ``;
    }
    if (!language) {
        language = ``;
    }
    if (!categories) {
        categories = ``;
    }
    if (!authors) {
        authors = ``;
    }
    if (!isbn) {
        isbn = ``;
    }
    try {
        const books = yield axios.get(`/api/books`,
            {params:
            {
                page: page,
                search: search,
                language: language,
                categories: categories,
                authors: authors,
                ISBN: isbn
            }
            }).then(res => res.data);
        yield put({type: types.BOOKS_RECEIVED, payload: books});
    } catch (error) {
        yield put({type: types.BOOKS_FAILED, error});
    }
}

export function* getRecommendedBooks(action) {
    const { page } = action;
    try {
        const books = yield axios.get(`/api/recommended?page=${page}`).then(res => res.data);
        yield put({type: types.RECOMMENDED_BOOKS_RECEIVED, payload: books});
    } catch (error) {
        yield put({type: types.RECOMMENDED_BOOKS_FAILED, error});
    }
}

export function* getBookBySlug(action) {
    const { slug } = action;
    try {
        const books = yield axios.get(`/api/books/${slug}`).then(res => res.data);
        yield put({type: types.BOOK_RECEIVED, payload: books});
    } catch (error) {
        yield put({type: types.BOOK_FAILED, error});
    }
}

function* getBookPdf(action) {
    const { file } = action;
    try {
        const books = yield axios.get(`/api/books/show_pdf/${file}`).then(res => res.data);
        yield put({type: types.BOOK_PDF_RECEIVED, payload: books});
    } catch (error) {
        yield put({type: types.BOOK_PDF_FAILED, error});
    }
}


export function* bookSaga() {
    yield all([
        yield takeLatest(types.GET_BOOKS, getBooks),
        yield takeLatest(types.GET_RECOMMENDED_BOOKS, getRecommendedBooks),
        yield takeLatest(types.GET_BOOK, getBookBySlug),
        yield takeLatest(types.GET_BOOK_PDF, getBookPdf)
    ]);
}
