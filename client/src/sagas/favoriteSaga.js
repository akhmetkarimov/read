import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";
import {getBooks, getBookBySlug} from "./bookSaga";

function* getFavorites(action) {
    const { page } = action;
    try {
        const favorites = yield axios.get(`/api/favorites_list?page=${page}`).then(res => res.data);
        yield put({type: types.FAVORITES_RECEIVED, payload: favorites});
    } catch (error) {
        yield put({type: types.FAVORITES_FAILED, error});
    }
}

function* addFavorite(action) {
    const { fav } = action;
    const filter = {
        page: fav.page,
        categories: fav.category
    };
    try {
        const favorites = yield axios.post(`/api/favorite`, {book: fav.id}).then(res => res.data);
        yield put({type: types.ADD_FAVORITE_SUCCESS, payload: favorites});
        if (fav.property === `main`) {
            yield getBooks({filter});
        } else if (fav.property === `book`) {
            yield getBookBySlug({slug: fav.slug});
        } else if (fav.property === `fav`) {
            yield getFavorites({page: fav.page});
        }
    } catch (error) {
        yield put({type: types.ADD_FAVORITE_FAILED, error});
    }
}

export function* favoriteSaga() {
    yield all([
        yield takeLatest(types.GET_FAVORITES, getFavorites),
        yield takeLatest(types.ADD_FAVORITE, addFavorite)
    ]);
}
