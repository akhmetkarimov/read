import { combineReducers } from 'redux';
import auth from "./authReducer";
import book from "./bookReducer";
import category from "./categoryReducer";
import favorite from "./favoriteReducer";
import language from "./languageReducer";
import user from "./userReducer";
import review from "./reviewReducer";
import author from "./authorReducer";

export default combineReducers({
    auth,
    book,
    category,
    favorite,
    language,
    user,
    review,
    author
});