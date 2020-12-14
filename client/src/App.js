import React from 'react';
import PrivateRoute from "./components/private-route";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Signin from './containers/signin';
import Main from './containers/main';
import {Provider} from "react-redux";
import configureStore from './store';
import './fonts/stylesheet.scss';
import Book from './containers/book';
import './App.less';
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from 'jwt-decode';
import * as types from "./actions/types";
import Favorite from './containers/favorite';
import ScrollIntoView from './components/scroll';
import Profile from './containers/profile';
import BookPdf from './containers/book-pdf';
import About from './containers/about';
import Instruction from './containers/instruction';
import Recommend from './containers/recommend';
import Faq from './containers/faq';


const store = configureStore();
if (localStorage.token) {
    setAuthToken(localStorage.token);
    const decoded = jwt_decode(localStorage.token);
    store.dispatch({type: types.SET_CURRENT_USER, payload: decoded});
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        localStorage.removeItem(`token`);
        setAuthToken(false);
        store.dispatch({type: types.SET_CURRENT_USER, payload: {}});
        window.location.href = `/`;
    }
}

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <Router>
                    <ScrollIntoView>
                        <Switch>
                            <Route exact path={`/signin`} component={Signin}/>
                            <Route exact path={`/about`} component={About}/>
                            <Route exact path={`/instruction`} component={Instruction}/>
                            <Route exact path={`/recommend`} component={Recommend}/>
                            <Route exact path={`/faq`} component={Faq}/>
                            <Route exact path={`/`} component={Main}/>
                            <Route exact path={`/book/:slug`} component={Book}/>
                            <PrivateRoute exact path={`/book/show/:file`} component={BookPdf}/>
                            <PrivateRoute exact path={`/favorite`} component={Favorite}/>
                            <PrivateRoute exact path={`/profile`} component={Profile}/>
                        </Switch>
                     </ScrollIntoView> 
                </Router>
            </Provider>
        </div>
    );
}

export default App;
