import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE
} from './actions';

const initialState = {
    loggedIn: false,
    user: null
}

export default function loginReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS: {
            const user = action.payload.user;
            return {loggedIn: true, user};
        }
        case LOGIN_FAILURE: {
            return {loggedIn: false, user: null};
        }
        default:
            return state;
    }
}