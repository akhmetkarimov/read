import isEmpty from '../validation/is-empty';
import * as types from '../actions/types';
const initialState = {
    isAuthenticated: false,
    user: {},
    isLoading: false,
};

export default function authReducer (state = initialState, action) {
    switch (action.type) {
    case types.SET_CURRENT_USER:
        return { ...state, isAuthenticated: !isEmpty(action.payload), user:action.payload, isLoading: false};
    case types.SIGN_IN:
        return { ...state, isLoading: true};
    case types.SIGN_IN_FAILED:
        return { ...state, isLoading: false, error: action.error};
    default:
        return state;
    }
}
