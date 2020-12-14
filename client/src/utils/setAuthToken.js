import axios from 'axios';
const setAuthToken = token => {
    if(token) {
        axios.defaults.headers.common[`Authorization`] = `Bearer ${token}`;
        // axios.defaults.xsrfCookieName = `csrftoken`;
        // axios.defaults.xsrfHeaderName = `X-CSRFToken`;
    } else {
        delete axios.defaults.headers.common[`Authorization`];
        // delete axios.defaults.xsrfCookieName;
        // delete axios.defaults.xsrfHeaderName;
    }
};
export default setAuthToken;