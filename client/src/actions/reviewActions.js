import * as types from './types';

export function getReviews(slug, page) {
    return { type: types.GET_REVIEWS, slug, page };
}

export function getUniReviews() {
    return { type: types.GET_UNI_REVIEWS };
}

export function getFaq() {
    return { type: types.GET_FAQ };
}

export function getStatistics() {
    return { type: types.GET_STATISTICS };
}

export function addReview(review) {
    return { type: types.ADD_REVIEW, review };
}

export function addRequest(request) {
    return { type: types.ADD_REQUEST, request };
}
