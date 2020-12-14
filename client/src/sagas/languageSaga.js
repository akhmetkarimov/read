import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";

function* getLanguages(action) {
    const { search } = action;
    try {
        const reviews = yield axios.get(`/api/search_languages?search=${search}`).then(res => res.data);
        yield put({type: types.LANGUAGES_RECEIVED, payload: reviews});
    } catch (error) {
        yield put({type: types.LANGUAGES_FAILED, error});
    }
}

export function* languageSaga() {
    yield all([
        yield takeLatest(types.GET_LANGUAGES, getLanguages)
    ]);
}
