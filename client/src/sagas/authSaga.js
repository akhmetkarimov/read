import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";
import jwt_decode from 'jwt-decode';
import setAuthToken from "../utils/setAuthToken";
import { message } from 'antd';

function* signIn(action) {
    const { data, history } = action;
    const studentData = {
        username: data.username,
        password: data.password,
    };
    if (data.student) {
        studentData.is_teacher = 0;
    } else if (data.teacher) {
        studentData.is_teacher = 1;
    }
    try {
        const authResponse = yield axios.post(data.student || data.teacher ? `/api/signin_kaznu` : `/api/signin/`,
            studentData).then(res => res.data);
        const { token } = authResponse;
        setAuthToken(token);
        localStorage.setItem(`token`, token);
        const decoded = jwt_decode(token);
        yield put({type: types.SET_CURRENT_USER, payload: decoded});
        history.push(`/`);
        // window.location.reload();
    } catch (error) {
        yield put({type: types.SIGN_IN_FAILED, error});
        message.error(`Ошибка при авторизации!`);
    }
}
function* signOut(action) {
    const { history } = action;
    localStorage.clear();
    document.cookie = ``;
    try {
        yield axios.post(`/api/logout`).then(res => res.data);
        setAuthToken(false);
        yield put ({type: types.SET_CURRENT_USER, payload: {}});
        history.push(`/signin`);
        // window.location.reload();
    } catch (error) {
        message.error(`Ошибка`);
    }

}


export function* authSaga() {
    yield all([
        yield takeLatest(types.SIGN_IN, signIn),
        yield takeLatest(types.SIGN_OUT, signOut)
    ]);
}
