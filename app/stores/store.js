import AppDispatcher from '../dispatcher/app-dispatcher';
import {EventEmitter} from 'events'

const CHANGE_EVENT = 'change';

var AppStore = {

    emitter: new EventEmitter(),

    items: ['one', 'two'],

    addChangeListener: function (cb) {
        this.emitter.on(CHANGE_EVENT, cb);
    },

    removeChangeListener: function (cb) {
        this.emitter.removeListener(CHANGE_EVENT, cb)
    },

    emitChange: function (action) {
        this.emitter.emit(CHANGE_EVENT);
    },

    getAll: function() {
        return this.items;
    }
};

AppDispatcher.register( function( payload ) {
    switch( payload.type ) {
        case 'test-action':
            AppStore.items.push(payload.payload);
            AppStore.emitChange();
            break;

    }
    return true; // Needed for Flux promise resolution
});

export default AppStore;
