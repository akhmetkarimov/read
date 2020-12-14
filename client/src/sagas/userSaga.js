import {all, put, takeLatest} from "@redux-saga/core/effects";
import * as types from "../actions/types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { message } from "antd";

function* getUser() {
    try {
        const user = yield axios.get(`/api/current/`).then(res => res.data);
        yield put({type: types.USER_RECEIVED, payload: user});
    } catch (error) {
        yield put({type: types.USER_FAILED, error});
        if (localStorage.token) {
            localStorage.removeItem(`token`);
            setAuthToken(false);
            yield put ({type: types.SET_CURRENT_USER, payload: {}});
            window.location.href = `/`;
        }
    }
}

function* changePassword(action) {
    const { password } = action;
    try {
        const user = yield axios.put(`/api/change_password`, password).then(res => res.data);
        yield put({type: types.USER_RECEIVED, payload: user});
        yield getUser();
        message.success(`Вы успешно изменили пароль!`);
    } catch (error) {
        yield put({type: types.USER_FAILED, error});
        message.success(`Ошибка при редактировании!`);
    }
}

export function* userSaga() {
    yield all([
        yield takeLatest(types.GET_USER, getUser),
        yield takeLatest(types.CHANGE_PASSWORD, changePassword)
    ]);
}
