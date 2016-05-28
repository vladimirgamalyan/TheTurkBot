
import { React } from 'react';
import { ReactDOM } from 'react-dom';

var Message = React.createClass({
    render: function () {
        return (
            <div className={this.props.message.own ? 'message-container-own':'message-container'}>
                <div className='message'>{this.props.message.text}</div>
            </div>
        );
    }
});

var Messages = React.createClass({
    render: function () {
        var data = this.props.data;
        var messageTemplate = data.map(function(item, index) {
            return (
                <Message message={item} key={index}>This is one comment</Message>
            )
        });

        return (
            <div className="messages">
                {messageTemplate}
            </div>
        );
    }
});

var KeyInput = React.createClass({
    handleChange: function(event) {
        var text = event.target.value;
        this.props.onChange(text);
    },
    render: function () {
        return (
            <form className="" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label for="token-input">Bot token</label>
                    <input
                        className ="form-control"
                        id="token-input"
                        type="text"
                        placeholder="Bot token"
                        value={this.props.value}
                        onChange={this.handleChange}
                    />
                </div>
            </form>
        );
    }
});

var MessageInput = React.createClass({
    getInitialState: function() {
        return {message: ''};
    },
    handleSubmit: function (event) {
        event.preventDefault();
        var text = this.state.message.trim();
        if (!text) {
            return;
        }
        this.props.onMessageSubmit(text);
        this.setState({message: ''});
    },
    handleChange: function(event) {
        var text = event.target.value;
        this.setState({message: text});
    },
    render: function () {
        return (
            <form className="" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input
                        className ="form-control"
                        type="text"
                        placeholder="Write a message..."
                        value={this.state.message}
                        onChange={this.handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-default">Post</button>
            </form>
        );
    }
});

var App = React.createClass({

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
                <Messages data={this.state.messages} />
                <MessageInput onMessageSubmit={this.handleMessageSubmit} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
