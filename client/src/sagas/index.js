import { all } from 'redux-saga/effects';
import {authSaga} from "./authSaga";
import {bookSaga} from "./bookSaga";
import {categorySaga} from "./categorySaga";
import {userSaga} from "./userSaga";
import {favoriteSaga} from "./favoriteSaga";
import {authorSaga} from "./authorSaga";
import {reviewSaga} from "./reviewSaga";
import {languageSaga} from "./languageSaga";

export default function* rootSaga() {
    yield all([
        authSaga(),
        bookSaga(),
        categorySaga(),
        userSaga(),
        favoriteSaga(),
        reviewSaga(),
        authorSaga(),
        languageSaga()
    ]);
}