import React from 'react';

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

export default KeyInput;
