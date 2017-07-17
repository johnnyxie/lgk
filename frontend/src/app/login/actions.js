import PluginManager from '../plugin/PluginManager';

export const LOGIN_SUCCESS = 'LOGIN::SUCCESS';
export const LOGIN_FAILURE = 'LOGIN::FAILURE';

export function loginSuccess(user) {
    return {
        type: LOGIN_SUCCESS,
        payload: {
            user
        }
    }
}

export function loginFailure() {
    return {
        type: LOGIN_FAILURE
    }
}

// data = {username: "admin", password: "admin"}
export function loginClick(data) {
    return (dispatch) => {
        Ext.Ajax.request({
            url: '/api/auth/authenticate',
            method: 'GET',
            params: data,

            success: (response, opts) => {
                let user = JSON.parse(response.responseText);
                dispatch(loginSuccess(user));
            },

            failure: (response, opts) => {
                dispatch(loginFailure());
            }
        });
    }
}
