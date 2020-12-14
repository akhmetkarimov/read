import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";

function* getAuthors(action) {
    const { search } = action;
    try {
        const authors = yield axios.get(`/api/search_authors?search=${search}`).then(res => res.data);
        yield put({type: types.AUTHORS_RECEIVED, payload: authors});
    } catch (error) {
        yield put({type: types.AUTHORS_FAILED, error});
    }
}

export function* authorSaga() {
    yield all([
        yield takeLatest(types.GET_AUTHORS, getAuthors)
    ]);
}
