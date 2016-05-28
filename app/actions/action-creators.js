import AppDispatcher from '../dispatcher/app-dispatcher';

let AppActions = {
    testAction: function(payload) {
        AppDispatcher.dispatch({
            type: 'test-action',
            payload: payload
        });
    }
};

export default AppActions;
