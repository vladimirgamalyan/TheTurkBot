import React from 'react';

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

export default MessageInput;
