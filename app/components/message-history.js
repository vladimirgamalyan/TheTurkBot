import React from 'react';

var Message = React.createClass({
    render: function () {
        return (
            <div className={this.props.message.own ? 'message-container-own':'message-container'}>
                <div className='message'>{this.props.message.text}</div>
            </div>
        );
    }
});

var MessageHistory = React.createClass({
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

export default  MessageHistory;
