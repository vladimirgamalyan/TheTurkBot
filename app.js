
var Message = React.createClass({
    render: function () {
        return (
            <div className='message'>{this.props.text}</div>
        );
    }
});

var Messages = React.createClass({
    render: function () {
        var data = this.props.data;
        var messageTemplate = data.map(function(item, index) {
            return (
                <Message text={item.text} key={index}>This is one comment</Message>
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
            <form className="key-input-form" onSubmit={this.handleSubmit}>
                <label for="token-input">TOKEN</label>
                <input
                    id="token-input"
                    type="text"
                    placeholder="Your key"
                    value={this.props.value}
                    onChange={this.handleChange}
                />
            </form>
        );
    }
});

var MessageInput = React.createClass({
    getInitialState: function() {
        return {message: ''};
    },
    render: function () {
        return (
            <form className="message-input-form" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.message}
                    onChange={this.handleAuthorChange}
                />
                <input type="submit" value="Post" />
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
                    if (result.message && result.message.text && result.message.message_id) {
                        newMessages.push({
                            text: result.message.text,
                            id: result.message.message_id
                        });
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

    render: function () {
        return (
            <div className="app">
                <KeyInput onChange={this.handleTokenChange} value={this.state.token} />
                <Messages data={this.state.messages} />
                <MessageInput />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
