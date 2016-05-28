import React from 'react';
import AppStore from '../stores/store';
import MessageHistory from '../components/message-history';
import KeyInput from '../components/key-input';
import MessageInput from '../components/message-input';
import ActionsCreator from '../actions/action-creators';

var TheTurkBot = React.createClass({

    BOT_API_URL: 'https://api.telegram.org/bot',

    getInitialState: function () {
        return {
            token: '',
            updateId: undefined,
            chatId: undefined,
            messages: []
        };
    },

    fetchMessages: function (cb) {
        var self = this,
            url = this.BOT_API_URL + this.state.token + '/getUpdates',
            checkStatus = function(response) {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response;
            },
            checkResponseOk = function (response) {
                if (response.ok !== true) {
                    throw new Error('response with "ok" field: ' + response.ok);
                }
                return response;
            },
            processResult = function (resultArray) {
                var newMessages = self.state.messages;
                resultArray.map(function (result) {
                    if (result.message) {
                        if (result.message.text && result.message.message_id) {
                            newMessages.push({
                                text: result.message.text,
                                id: result.message.message_id,
                                own: false
                            });
                        }
                        if (result.message.chat && result.message.chat.id) {
                            self.setState({chatId: result.message.chat.id});
                            console.log('chat id: ', result.message.chat.id);
                        }
                    }

                    if (result.update_id) {
                        if ((self.state.updateId === undefined) || (result.update_id + 1 > self.state.updateId)) {
                            self.setState({updateId: result.update_id + 1});
                        }
                    }
                });
                self.setState(newMessages);
            };


        url = url + '?timeout=10';
        if (this.state.updateId !== undefined) {
            url = url + '&offset=' + this.state.updateId;
        }

        window.fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .then(checkResponseOk)
            .then(response => response.result)
            .then(processResult)
            .then(function () {
                cb();
            })
            .catch(function(error) {
                console.log('Request failed', error);
                setTimeout(cb, 2000);
            });
    },

    componentDidMount: function () {
        var token = localStorage.getItem('bot-token') || '';
        this.setState({token: token});

        var polling = () => {
            this.fetchMessages(polling);
        };
        polling();
    },

    handleTokenChange: function(value) {
        localStorage.setItem('bot-token', value);
        this.setState({token: value});
    },

    handleMessageSubmit: function (value) {
        var url;
        if (this.state.chatId) {
            url = this.BOT_API_URL + this.state.token + '/sendMessage?chat_id=' + this.state.chatId + '&text=' + value;
            window.fetch(url).then( () => {
                var newMessages = this.state.messages;
                newMessages.push({
                    text: value,
                    id: +new Date(),
                    own: true
                });
                console.log(newMessages);
                this.setState({messages: newMessages});
            });
        }
    },

    render: function () {
        return (
            <div className="app">
                <KeyInput onChange={this.handleTokenChange} value={this.state.token} />
                <MessageHistory data={this.state.messages} />
                <MessageInput onMessageSubmit={this.handleMessageSubmit} />
            </div>
        );
    }
});

var TestButton = React.createClass({
    createNewItem: function () {
        ActionsCreator.testAction('hooys');
    },
    render: function () {
        return (
            <button onClick={ this.createNewItem } className="btn btn-default">TEST</button>
        );
    }
});

var TestView = React.createClass({

    getInitialState: function() {
        return {
            data: AppStore.getAll()
        };
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            data: AppStore.getAll()
        });
    },

    render: function () {
        var items = this.state.data;
        var itemHtml = items.map( function( item, index ) {
            return <div key={index}>
                { item }
            </div>;
        });

        return (
            <div>
                { itemHtml }
            </div>
        )
    }
});

export default TheTurkBot;
