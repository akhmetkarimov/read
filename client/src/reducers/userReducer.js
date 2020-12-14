
import * as types from '../actions/types';
const initialState = {
    user: {},
    isLoading: false,
};

export default function userReducer (state = initialState, action) {
    switch (action.type) {
    case types.GET_USER:
        return { ...state, isLoading: true };
    case types.USER_RECEIVED:
        return { ...state, isLoading: false, user: action.payload };
    case types.USER_FAILED:
        return { ...state, isLoading: false, error: action.error };
    default:
        return state;
    }
}
