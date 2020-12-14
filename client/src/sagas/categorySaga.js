import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";

function* getCategories() {
    try {
        const categories = yield axios.get(`/api/categories`).then(res => res.data);
        yield put({type: types.CATEGORIES_RECEIVED, payload: categories});
    } catch (error) {
        yield put({type: types.CATEGORIES_FAILED, error});
    }
}

function* getSearchCategories(action) {
    const { search } = action;
    try {
        const categories = yield axios.get(`/api/search_categories?search=${search}`).then(res => res.data);
        yield put({type: types.SEARCH_CATEGORIES_RECEIVED, payload: categories});
    } catch (error) {
        yield put({type: types.SEARCH_CATEGORIES_FAILED, error});
    }
}

export function* categorySaga() {
    yield all([
        yield takeLatest(types.GET_CATEGORIES, getCategories),
        yield takeLatest(types.GET_CATEGORIES_SEARCH, getSearchCategories)
    ]);
}
