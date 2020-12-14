import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";
import { message } from "antd";

function* getReviews(action) {
    const { slug, page } = action;
    try {
        const reviews = yield axios.get(`/api/review/${slug}?page=${page}`).then(res => res.data);
        yield put({type: types.REVIEWS_RECEIVED, payload: reviews});
    } catch (error) {
        yield put({type: types.REVIEWS_FAILED, error});
    }
}

function* addRequest(action) {
    const { request } = action;
    try {
        const requestResponse = yield axios.post(`/api/university_request`, request).then(res => res.data);
        message.success(`Вы успешно оставили заявку. С вами скоро свяжутся.`);
        yield put({type: types.ADD_REQUEST_SUCCESS, payload: requestResponse});
    } catch (error) {
        message.error(`Ошибка при отправке. Просим попробовать еще раз`);
        yield put({type: types.ADD_REQUEST_FAILED, error});
    }
}

function* getFaq() {
    try {
        const faq = yield axios.get(`/api/faq`).then(res => res.data);
        yield put({type: types.FAQ_RECEIVED, payload: faq});
    } catch (error) {
        yield put({type: types.FAQ_FAILED, error});
    }
}

function* getStatistics() {
    try {
        const statistics = yield axios.get(`/api/statistic`).then(res => res.data);
        yield put({type: types.STATISTICS_RECEIVED, payload: statistics});
    } catch (error) {
        yield put({type: types.STATISTICS_RECEIVED, error});
    }
}

function* getUniReviews() {
    try {
        const reviews = yield axios.get(`/api/university_reviews`).then(res => res.data);
        yield put({type: types.UNI_REVIEWS_RECEIVED, payload: reviews});
    } catch (error) {
        yield put({type: types.UNI_REVIEWS_FAILED, error});
    }
}

function* addReview(action) {
    const { review } = action;
    const reviewItem = {
        book: review.book,
        star: review.rate,
        review_content: review.content
    };
    try {
        const favorites = yield axios.post(`/api/review`, reviewItem).then(res => res.data);
        yield put({type: types.ADD_REVIEW_SUCCESS, payload: favorites});
        yield getReviews({page: review.page, slug: review.slug});
        message.success(`Спасибо за отзыв. Дождитесь модерацию администратора.`);
    } catch (error) {
        yield put({type: types.ADD_REVIEW_FAILED, error});
    }
}


export function* reviewSaga() {
    yield all([
        yield takeLatest(types.GET_REVIEWS, getReviews),
        yield takeLatest(types.GET_FAQ, getFaq),
        yield takeLatest(types.ADD_REVIEW, addReview),
        yield takeLatest(types.ADD_REQUEST, addRequest),
        yield takeLatest(types.GET_UNI_REVIEWS, getUniReviews),
        yield takeLatest(types.GET_STATISTICS, getStatistics),
    ]);
}
